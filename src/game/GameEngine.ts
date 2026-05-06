export const GRID_SIZE = 8;
export const NUM_TYPES = 6;

export interface TileData {
  id: number;
  type: number; // 0 to 5, or -1 for empty
  x: number;
  y: number;
}

let nextTileId = 0;

export function createInitialGrid(): TileData[][] {
  const grid: TileData[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: TileData[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        id: nextTileId++,
        type: Math.floor(Math.random() * NUM_TYPES),
        x,
        y
      });
    }
    grid.push(row);
  }
  
  // Basic pre-clear to ensure no initial matches (simplified for now)
  // In a full implementation, we'd ensure no matches on start.
  return grid;
}

export function findMatches(grid: TileData[][]): { matches: Set<number>, score: number } {
  const matches = new Set<number>();
  let score = 0;

  // Horizontal matches
  for (let y = 0; y < GRID_SIZE; y++) {
    let matchLength = 1;
    for (let x = 0; x < GRID_SIZE; x++) {
      let checkEmpty = false;
      if (x < GRID_SIZE - 1 && grid[y][x].type === grid[y][x + 1].type && grid[y][x].type !== -1) {
        matchLength++;
      } else {
        checkEmpty = true;
      }

      if (checkEmpty) {
        if (matchLength >= 3) {
          score += matchLength * 10;
          for (let i = 0; i < matchLength; i++) {
            matches.add(grid[y][x - i].id);
          }
        }
        matchLength = 1;
      }
    }
  }

  // Vertical matches
  for (let x = 0; x < GRID_SIZE; x++) {
    let matchLength = 1;
    for (let y = 0; y < GRID_SIZE; y++) {
      let checkEmpty = false;
      if (y < GRID_SIZE - 1 && grid[y][x].type === grid[y + 1][x].type && grid[y][x].type !== -1) {
        matchLength++;
      } else {
        checkEmpty = true;
      }

      if (checkEmpty) {
        if (matchLength >= 3) {
          score += matchLength * 10;
          for (let i = 0; i < matchLength; i++) {
            matches.add(grid[y - i][x].id);
          }
        }
        matchLength = 1;
      }
    }
  }

  return { matches, score };
}

export function applyGravity(grid: TileData[][], matches: Set<number>): TileData[][] {
  const newGrid: TileData[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

  for (let x = 0; x < GRID_SIZE; x++) {
    let emptyCount = 0;
    // Process column from bottom to top
    for (let y = GRID_SIZE - 1; y >= 0; y--) {
      const tile = grid[y][x];
      if (matches.has(tile.id) || tile.type === -1) {
        emptyCount++;
      } else {
        const newY = y + emptyCount;
        newGrid[newY][x] = { ...tile, y: newY, x };
      }
    }

    // Fill empty spaces at the top
    for (let y = 0; y < emptyCount; y++) {
      newGrid[y][x] = {
        id: nextTileId++,
        type: Math.floor(Math.random() * NUM_TYPES),
        x,
        y
      };
    }
  }

  return newGrid;
}
