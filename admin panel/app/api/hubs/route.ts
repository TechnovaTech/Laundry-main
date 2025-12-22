import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Hub from '@/models/Hub'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const hubData = await request.json()
    const newHub = new Hub(hubData)
    const savedHub = await newHub.save()
    
    return NextResponse.json({
      success: true,
      data: savedHub
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create hub'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const pincode = searchParams.get('pincode')
    
    let query: any = { isActive: true }
    if (pincode) {
      query = { ...query, pincodes: pincode }
    }
    
    const hubs = await Hub.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: hubs
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch hubs'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Hub ID is required'
      }, { status: 400 })
    }
    
    const hubData = await request.json()
    const updatedHub = await Hub.findByIdAndUpdate(id, hubData, { new: true })
    
    if (!updatedHub) {
      return NextResponse.json({
        success: false,
        message: 'Hub not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: updatedHub
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update hub'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Hub ID is required'
      }, { status: 400 })
    }
    
    const deletedHub = await Hub.findByIdAndDelete(id)
    
    if (!deletedHub) {
      return NextResponse.json({
        success: false,
        message: 'Hub not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Hub deleted successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete hub'
    }, { status: 500 })
  }
}
