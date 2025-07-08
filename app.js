/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const wordBank = ['banana', 'apple', 'orange', 'grape', 'peach', 'melon', 'kiwi', 'mango', 'lemon', 'plum']

function App() {
  
  // initialize the game
  
  const [scrambledWords, setScrambledWords] = React.useState(() => wordBank.map(word => shuffle(word)))
  const [currentIndex, setCurrentIndex] = React.useState(Number(localStorage.getItem('currentIndex')) || 0)
  const [guess, setGuess] = React.useState('')
  const [points, setPoints] = React.useState(Number(localStorage.getItem('points')) || 0)
  const [strikes, setStrikes] = React.useState(Number(localStorage.getItem('strikes')) || 0)
  const [passes, setPasses] = React.useState(Number(localStorage.getItem('passes')) || 3)
  const [gameOver, setGameOver] = React.useState(false)

  // Save game state to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('currentIndex', currentIndex)
    localStorage.setItem('points', points)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)
  }, [currentIndex, points, strikes, passes])

  // Handle user input
  const handleChange = (e) => setGuess(e.target.value)

  // Handle guess submission
  const handleGuess = (e) => {
    
    //stop the page from refreshing
    e.preventDefault()
    
    // check if guess is empty
    if (!guess) {
      return
    }
    
    // clear the guess input
    setGuess('')
    
    // officially check the guess
    if (guess === wordBank[currentIndex]) {
      setPoints(p => p + 1)
      nextWord()
    } else {
      setStrikes(s => s + 1)
      if (strikes + 1 >= 3) {
        setGameOver(true)
      }
    }
  }

  // check the number of passes left
  const handlePass = () => {
    if (passes > 0) {
      setPasses(p => p - 1)
      nextWord()
    }
  }

  // Move to the next word
  const nextWord = () => {
    if (currentIndex + 1 >= scrambledWords.length) {
      setGameOver(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  // Restart the game
  const handleRestart = () => {
    setScrambledWords(wordBank.map(word => shuffle(word)))
    setCurrentIndex(0)
    setPoints(0)
    setStrikes(0)
    setPasses(3)
    setGameOver(false)
    setGuess('')
    localStorage.clear()
  }

  if (gameOver) {
    return (
      <div className="game-container">
        <div className="game-over">
          <h1 className="game-over-title">Game Over</h1>
          <p className="game-over-info">Final Score: {points} points</p>
          <p className="game-over-info">Total Strikes: {strikes}</p>
          <p className="game-over-info">Reason: {strikes >= 3 ? 'Too many incorrect guesses' : 'All words completed!'}</p>
          <button className="btn btn-restart" onClick={handleRestart}>Play Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Fruit Scramble Game</h1>
      <p className="game-instruction">Only use lowercase letters. You only have 3 strikes and 3 passes.</p>
      <p className="word-info">Word {currentIndex + 1} of {scrambledWords.length}</p>
      <p className="word-info">Scrambled Word: <strong className="scrambled-word">{scrambledWords[currentIndex]}</strong></p>
      <form className="guess-form" onSubmit={handleGuess}>
        <input 
          className="guess-input"
          type="text"
          value={guess} 
          onChange={handleChange} 
          autoFocus
          placeholder="Enter your guess..."
        />
        <button className="btn btn-guess" type="submit">Guess</button>
      </form>
      {passes > 0 ? (
        <button className="btn btn-pass" onClick={handlePass}>
          Pass ({passes} left)
        </button>
      ) : null}
      <button className="btn btn-restart" onClick={handleRestart}>Restart Game</button>
      <div className="game-stats">
        <span>Points: {points}</span>
        <span>Strikes: {strikes}/3</span>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
