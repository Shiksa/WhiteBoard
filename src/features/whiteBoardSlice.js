import { createSlice } from "@reduxjs/toolkit";

const whiteBoardSlice = createSlice({
  name: "whiteBoard",
  initialState: {
    isDrawing: false, //whether the user is currently drawing
    currentColor: '#000000', //default color black
    brushSize: 3, //default brush size
    drawingActions: [], //keep track of drawing history for undo/redo
    currentPath: [], //store the current path being drawn
    currentStyle: { color: '#000000', size: 3 }, //store the style of the current path
  },
  reducers: {

    setIsDrawing(state, action) { //set drawing state
      state.isDrawing = action.payload;
    },

    setCurrentColor(state, action) { //change brush color
      state.currentColor = action.payload;
      state.currentStyle.color = action.payload;
    },

    setBrushSize(state, action) { //change brush size 
      state.brushSize = action.payload;
      state.currentStyle.size = action.payload;
    },

    setCurrentPath(state, action) { //set current path on mouse down only during start and reset on mouse up
      state.currentPath = action.payload;
    },

    addCurrentPath(state, action) { //add point to current path on mouse move to continue drawing
      state.currentPath.push(action.payload);
    },

    // setDrawingActions(state, action) { //set drawing actions for undo
    //   state.drawingActions = action.payload;
    // },

    addDrawingAction(state, action) { //add new drawing action
      state.drawingActions.push(action.payload);
    },

    undoDrawing(state, action) { //undo last drawing action
      if (state.drawingActions.length > 0) {
        state.drawingActions.pop();
      }
    },

    clearAll(state, action) { //clear entire drawing
      state.isDrawing = false;
      state.currentPath = [];
      state.drawingActions = [];
    },
  }
});

export const {
  setIsDrawing,
  setCurrentColor,
  setBrushSize,
  setCurrentPath,
  addCurrentPath,
  setDrawingActions,
  addDrawingAction,
  undoDrawing,
  clearAll
} = whiteBoardSlice.actions;

export default whiteBoardSlice.reducer;