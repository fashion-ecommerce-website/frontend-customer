/**
 * Virtual Try-On API Route
 * Handles Fitroom Virtual Try-On API integration
 */

import { NextRequest, NextResponse } from 'next/server';

// Fitroom API configuration
const FITROOM_API_BASE = 'https://platform.fitroom.app/api/tryon/v2';
const FITROOM_API_KEY = process.env.FITROOM_API_KEY || '6efa706137cd4c2188c128fc1968484cc6ea9b1141f4fdf4259ea5bddbd62788';
const FITROOM_STATUS_API_KEY = process.env.FITROOM_STATUS_API_KEY || '38f436e1fb294a5bb62268350044db75f3f14b5003b4c21d434a14fa6b1184ba';

/**
 * Types
 */
interface FitroomTaskResponse {
  task_id: string;
  status: string;
  message?: string;
}

interface FitroomStatusResponse {
  task_id: string;
  status: string;
  download_signed_url?: string;
  message?: string;
  error?: string;
}

/**
 * POST /api/virtual-tryon
 * Create a virtual try-on task
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const modelImage = formData.get('model_image') as File;
    const clothImage = formData.get('cloth_image') as File;
    const clothType = formData.get('cloth_type') as string || 'upper';

    // Validate required fields
    if (!modelImage || !clothImage) {
      return NextResponse.json(
        { error: 'Missing model image or cloth image' },
        { status: 400 }
      );
    }

    console.log('🚀 Creating Fitroom virtual try-on task...');

    // Create FormData for Fitroom API
    const fitroomFormData = new FormData();
    fitroomFormData.append('model_image', modelImage);
    fitroomFormData.append('cloth_image', clothImage);
    fitroomFormData.append('cloth_type', clothType);

    // Call Fitroom API to create task
    const response = await fetch(`${FITROOM_API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'X-API-KEY': FITROOM_API_KEY,
      },
      body: fitroomFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fitroom API error:', response.status, errorText);
      throw new Error(`Fitroom API error: ${response.status} - ${errorText}`);
    }

    const taskData: FitroomTaskResponse = await response.json();
    console.log('✅ Fitroom task created:', taskData.task_id);

    return NextResponse.json({
      success: true,
      taskId: taskData.task_id,
      status: taskData.status,
      message: taskData.message || 'Task created successfully',
    });

  } catch (error) {
    console.error('❌ Error creating Fitroom task:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create virtual try-on task',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/virtual-tryon?taskId=xxx
 * Check the status of a virtual try-on task
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    // Validate required parameter
    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing task ID' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking status for task: ${taskId}`);

    // Check task status with Fitroom API
    const response = await fetch(`${FITROOM_API_BASE}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': FITROOM_STATUS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fitroom status API error:', response.status, errorText);
      throw new Error(`Fitroom status API error: ${response.status}`);
    }

    const statusData: FitroomStatusResponse = await response.json();
    console.log(`📊 Task ${taskId} status: ${statusData.status}`);

    return NextResponse.json({
      success: true,
      taskId: statusData.task_id,
      status: statusData.status,
      resultImageUrl: statusData.download_signed_url,
      message: statusData.message,
      error: statusData.error,
    });

  } catch (error) {
    console.error('❌ Error checking Fitroom status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check task status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
