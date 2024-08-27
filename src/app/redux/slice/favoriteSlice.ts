import { createSlice, PayloadAction, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { FavoriteObj } from '../../../../@types/dto';

type FavoritesState = {
  favorites: FavoriteObj[];
  loading: boolean;
  error: string | null;
};

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};


//Получения избранного
export const fetchFavorites = createAsyncThunk<FavoriteObj[], void, { state: RootState }>(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/favorite/all');
      if (!res.ok) {
        throw new Error('Ошибка при загрузке избранного');
      }
      const data = await res.json();
      return data.favoriteObjects as FavoriteObj[];
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

//Добавления в избранное
export const addFavorite = createAsyncThunk<void, string, { state: RootState }>(
  'favorites/addFavorite',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`/api/favorite/add/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Ошибка при добавлении в избранное');
      }
      dispatch(fetchFavorites());
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

//Удаления из избранного
export const deleteFavorite = createAsyncThunk<void, string, { state: RootState }>(
    'favorites/deleteFavorite',
    async (id, { dispatch, rejectWithValue }) => {
      try {
        const res = await fetch(`/api/favorite/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!res.ok) {
          throw new Error('Ошибка при удалении из избранного');
        }
  
        // После успешного удаления вызываем обновление списка избранного
        dispatch(fetchFavorites());
      } catch (err) {
        return rejectWithValue((err as Error).message);
      }
    }
  );



//Slice 
const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<FavoriteObj[]>) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка';
      })
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка';
      })
      .addCase(deleteFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFavorite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка';
      });
  },
});

export default favoriteSlice.reducer;
