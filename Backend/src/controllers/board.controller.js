import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Board } from '../models/board.model.js'
// import { uploadOnCloudinary } from "../utils/cloundinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBoard = asyncHandler(async(req , res) => {

})

const getMyBoards = asyncHandler(async(req , res) => {
  
})

const getBoardById = asyncHandler(async(req , res) => {
  
})

const updateBoard = asyncHandler(async(req , res) => {
  
})

const deleteBoard = asyncHandler(async(req , res) => {
  
})

const addMember = asyncHandler(async(req , res) => {
  
})

const removeMember = asyncHandler(async(req , res) => {
  
})

const leaveBoard = asyncHandler(async(req , res) => {
  
})


export {
  createBoard, 
  getMyBoards, 
  getBoardById, 
  updateBoard, 
  deleteBoard, 
  addMember, 
  removeMember, 
  leaveBoard
}