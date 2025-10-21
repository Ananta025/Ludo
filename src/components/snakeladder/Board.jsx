import { StyleSheet, View, Image } from 'react-native'
import React, { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { 
  selectSnakeLadderPlayer1,
  selectSnakeLadderPlayer2, 
  selectSnakeLadderPlayer3,
  selectSnakeLadderPlayer4,
  selectSnakeLadderSnakes, 
  selectSnakeLadderLadders 
} from '../../redux/snakeladder/snakeLadderSelectors'
import BoardSquare from './BoardSquare'
import { deviceWidth } from '../../constants/Scaling'

// Import snake and ladder images
import SnakeImage from '../../assets/images/snakeladder/snake1.png'
import LadderImage from '../../assets/images/snakeladder/ladder.png'

const Board = () => {
  const player1 = useSelector(selectSnakeLadderPlayer1);
  const player2 = useSelector(selectSnakeLadderPlayer2);
  const player3 = useSelector(selectSnakeLadderPlayer3);
  const player4 = useSelector(selectSnakeLadderPlayer4);
  const snakes = useSelector(selectSnakeLadderSnakes);
  const ladders = useSelector(selectSnakeLadderLadders);
  
  const players = [player1, player2, player3, player4];

  const boardSize = useMemo(() => {
    const cellWidth = deviceWidth * 0.1;
    const cellHeight = cellWidth * 1.3;

    return {
      cellWidth,
      cellHeight,
      boardWidth: cellWidth * 10,
      boardHeight: cellHeight * 10,
    };
  }, []);

  // Function to convert square number to row/col coordinates
  const getSquarePosition = useMemo(() => (squareNumber) => {
    const adjustedNumber = squareNumber - 1; // Convert to 0-based
    const row = Math.floor(adjustedNumber / 10);
    const col = adjustedNumber % 10;
    
    // Handle snake-ladder pattern (alternate rows)
    const actualRow = 9 - row; // Flip row (board starts from 100 at top)
    const actualCol = row % 2 === 0 ? col : 9 - col; // Alternate direction
    
    return { row: actualRow, col: actualCol };
  }, []);

  // Simplified approach: Create visual connections between snake/ladder positions
  const createSnakeLadderOverlays = useMemo(() => {
    const overlays = [];
    
    // Add snake overlays
    snakes.forEach((snake, index) => {
      const headPos = getSquarePosition(snake.head);
      const tailPos = getSquarePosition(snake.tail);
      
      // Calculate spanning area
      const leftCol = Math.min(headPos.col, tailPos.col);
      const rightCol = Math.max(headPos.col, tailPos.col);
      const topRow = Math.min(headPos.row, tailPos.row);
      const bottomRow = Math.max(headPos.row, tailPos.row);
      
      overlays.push({
        type: 'snake',
        id: `snake-${index}`,
        left: leftCol * boardSize.cellWidth,
        top: topRow * boardSize.cellHeight,
        width: (rightCol - leftCol + 1) * boardSize.cellWidth,
        height: (bottomRow - topRow + 1) * boardSize.cellHeight,
      });
    });
    
    // Add ladder overlays
    ladders.forEach((ladder, index) => {
      const bottomPos = getSquarePosition(ladder.bottom);
      const topPos = getSquarePosition(ladder.top);
      
      // Calculate spanning area
      const leftCol = Math.min(bottomPos.col, topPos.col);
      const rightCol = Math.max(bottomPos.col, topPos.col);
      const topRow = Math.min(bottomPos.row, topPos.row);
      const bottomRow = Math.max(bottomPos.row, topPos.row);
      
      overlays.push({
        type: 'ladder',
        id: `ladder-${index}`,
        left: leftCol * boardSize.cellWidth,
        top: topRow * boardSize.cellHeight,
        width: (rightCol - leftCol + 1) * boardSize.cellWidth,
        height: (bottomRow - topRow + 1) * boardSize.cellHeight,
      });
    });
    
    return overlays;
  }, [snakes, ladders, getSquarePosition, boardSize]);

  // Generate board squares (1-100) - mobile optimized layout
  const generateBoard = () => {
    const board = [];
    
    // Generate 10 rows (from 100 to 1, snake-ladder board pattern)
    for (let row = 9; row >= 0; row--) {
      const rowSquares = [];
      
      // Alternate direction for snake-ladder pattern
      if (row % 2 === 0) {
        // Even rows (0, 2, 4, 6, 8): left to right
        for (let col = 0; col < 10; col++) {
          const squareNumber = row * 10 + col + 1;
          rowSquares.push(createSquare(squareNumber));
        }
      } else {
        // Odd rows (1, 3, 5, 7, 9): right to left
        for (let col = 9; col >= 0; col--) {
          const squareNumber = row * 10 + col + 1;
          rowSquares.push(createSquare(squareNumber));
        }
      }
      
      board.push(
        <View key={row} style={[styles.row, { height: boardSize.cellHeight }]}>
          {rowSquares}
        </View>
      );
    }
    
    return board;
  };

  const createSquare = (number) => {
    // Find players on this square (only show started players on board)
    const playersOnSquare = players
      .filter(player => player.position === number && player.hasStarted)
      .map(player => ({
        id: player.id,
        color: player.color,
      }));
    
    const snake = snakes.find(s => s.head === number || s.tail === number);
    const ladder = ladders.find(l => l.bottom === number || l.top === number);
    
    const hasSnake = !!snake;
    const hasLadder = !!ladder;
    const isSnakeHead = snake?.head === number;
    const isLadderBottom = ladder?.bottom === number;

    return (
      <View 
        key={number} 
        style={[styles.cellContainer, { width: boardSize.cellWidth, height: boardSize.cellHeight }]}
      >
        <BoardSquare
          number={number}
          players={playersOnSquare}
          hasSnake={hasSnake}
          hasLadder={hasLadder}
          isSnakeHead={isSnakeHead}
          isLadderBottom={isLadderBottom}
          onPress={() => handleSquarePress(number)}
          showImages={false} // Disable individual square images
        />
      </View>
    );
  };

  const handleSquarePress = (number) => {
    // Optional: Add debugging or special interactions
    console.log(`Snake & Ladder square ${number} pressed`);
  };

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.board, 
          { 
            width: boardSize.boardWidth, 
            height: boardSize.boardHeight 
          }
        ]}
      >
        {/* Board squares */}
        {generateBoard()}
        
        {/* Snake and Ladder overlays */}
        {createSnakeLadderOverlays.map(overlay => (
          <View
            key={overlay.id}
            style={[
              overlay.type === 'snake' ? styles.snakeOverlay : styles.ladderOverlay,
              {
                left: overlay.left,
                top: overlay.top,
                width: overlay.width,
                height: overlay.height,
              }
            ]}
          >
            <Image 
              source={overlay.type === 'snake' ? SnakeImage : LadderImage}
              style={overlay.type === 'snake' ? styles.snakeOverlayImage : styles.ladderOverlayImage}
              resizeMode="stretch"
            />
          </View>
        ))}
      </View>
    </View>
  )
}

export default memo(Board)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  board: {
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  cellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  snakeOverlay: {
    position: 'absolute',
    zIndex: 5,
    pointerEvents: 'none',
  },
  ladderOverlay: {
    position: 'absolute',
    zIndex: 5,
    pointerEvents: 'none',
  },
  snakeOverlayImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  ladderOverlayImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
})