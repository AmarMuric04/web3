import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FavoritesState = {
  favorited: string[];
};

const initialState: FavoritesState = {
  favorited: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavoriteCoin: (state, { payload }: PayloadAction<string>) => {
      const index = state.favorited.findIndex((id) => id === payload);
      if (index !== -1) {
        state.favorited.splice(index, 1);
      } else {
        state.favorited.push(payload);
      }
    },
    clearFavoriteCoins: (state) => {
      state.favorited = [];
    },
  },
});

export const { toggleFavoriteCoin, clearFavoriteCoins } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
