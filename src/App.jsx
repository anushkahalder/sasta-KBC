import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { fetchQues, mapAns, resetGame, updateAnsArray } from './working/workingSlice';
import { useEffect, useState } from 'react';

function App() {


  const dispatch = useDispatch();
  const state = useSelector((state) => state.quiz);
  const ansArray = [...state.ansArray]



  const [page, setPage] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [selectedOp, setSelectedOp] = useState(-1);
  const [quesId, setQuesId] = useState(0)
  const [markSelect, SetMarkSelect] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [review, setReview] = useState('');
  const [currentlySelected, setCurrentlySelected] = useState(null);

  const itemsPerPage = 1
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = page * itemsPerPage






  if (state.isLoading === true) {
    return <h1>loading data...</h1>
  }



  const startGame = () => {
    dispatch(fetchQues())
    setGameStart(true);
    setPage(page + 1)
  }

  const pageIncrement = (id) => {

    console.log(page, currentPage, "pagee")


    //option is valid
    if (state.ansArray[currentQuestionId] !== undefined || state.ansArray[currentQuestionId] !== -1) {
      if (page < currentPage && markSelect === true) {
        console.log("valid op yet selected")
        dispatch(updateAnsArray([selectedOp, quesId]))
        SetMarkSelect(false)
        setPage(page + 1)
        setCurrentlySelected(null)

      }
      if (page < currentPage && markSelect === false) {
        console.log("valid op and not selected")
        setPage(page + 1)
      }
    }

    //if the ques is skipped
    if (state.ansArray[currentQuestionId] === -1) {
      if (page < currentPage && markSelect === true) {
        console.log("skipped op yet selected")

        dispatch(updateAnsArray([selectedOp, quesId]))
        SetMarkSelect(false)
        setPage(page + 1)
        setCurrentlySelected(null)
      }

    }

    //normal condition
    if (!state.ansArray[currentQuestionId] && page === currentPage && markSelect) {
      console.log("normal")
      dispatch(updateAnsArray([selectedOp, quesId]))
      SetMarkSelect(false)
      setPage(page + 1)
      setCurrentPage(currentPage + 1)
      setSelectedOp(-1)
      setCurrentlySelected(null)
    }
  }

  const pageDecrement = () => {
    setPage(page - 1)
    SetMarkSelect(false)


  }

  // const markSelected = (optionNumber, quesNo) => {
  //   setCurrentlySelected({ quesNo, optionNumber });
  //   setSelectedOp(optionNumber)
  //   setQuesId(quesNo)
  //   SetMarkSelect(true)


  // }

  const markSelected = (optionNumber, quesNo) => {
    setCurrentlySelected({ quesNo, optionNumber });
    setSelectedOp(optionNumber);
    setQuesId(quesNo);
    SetMarkSelect(true);
  };




  const saveQuiz = () => {
    dispatch(mapAns());
    console.log(state, "state value")
  }

  const reset = () => {

    dispatch(resetGame())
    dispatch(fetchQues())
    setGameStart(true);
    setPage(1)
    setSelectedOp(-1)
    setQuesId(0);
    SetMarkSelect(false);
    setCurrentPage(1);
    setReview(false)

  }

  const handleViewAll = () => {
    setPage(1);
  }

  const handleReview = () => {
    setPage(1)
    setReview(true)
  }


  const skipQuestion = (questionId) => {
    SetMarkSelect(false);
    // Set the answer as -1 to indicate it's skipped
    dispatch(updateAnsArray([-1, questionId]));
    setSelectedOp(-1); // Clear the selected option
    setCurrentlySelected(null); // Clear the current selection state
    setCurrentPage(currentPage + 1); // Move to the next page
    setPage(page + 1); // Update the page state
  };

  let currentQuestionId = 0
  if (page > 0) {
    currentQuestionId = state.data[page - 1]?.id;
  }


  console.log(markSelect)



  return (
    <>
      {!review && (
        <div className="quiz-container">
          <button className="start-game-btn" onClick={startGame} hidden={page > 0}>Start Game</button>

          {page > 0 &&
            <button className="reset-btn" onClick={reset}>Reset Game</button>
          }

          <div className="question-section">
            {state.data &&
              state.data.slice(startIndex, endIndex).map((item) => (
                <div key={item.id} className="question-block">
                  <p className="numeric">{`Question ${page}/10`}</p>
                  <hr className="hr-divider" />
                  <p className="question-text">{item.question}</p>
                  <div className="options-container">
                    {item.options?.map((option, i) => (
                      <div
                        key={i}
                        className={`option ${ansArray[item.id] === i ? 'option-selected' : ''} 
              ${currentlySelected?.quesNo === item.id && currentlySelected.optionNumber === i ? 'option-highlight' : ''}`}
                        onClick={() => markSelected(i, item.id)}
                      >
                        <p>{i + 1}: {option}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {gameStart && (
              <div className="navigation-buttons">
                <button className="nav-btn prev-btn" onClick={pageDecrement} disabled={page === 1} hidden={page === 11}>Prev</button>
                <button className="nav-btn skip-btn" onClick={() => skipQuestion(currentQuestionId)} hidden={page === 11}>Skip</button>
                <button className="nav-btn next-btn" onClick={pageIncrement} hidden={page === 11} disabled={!markSelect && page === currentPage}>Next</button>
              </div>
            )}
          </div>

          {page === 11 && (
            <div className="end-section">
              <button className="submit-btn" onClick={saveQuiz}>Submit Quiz</button>
              {state.score !== null ? (
                <div className="score-section">
                  <p className="score-text">Score: {state.score}</p>
                  <button className="review-btn" onClick={handleReview}>View Performance</button>
                </div>
              ) : (
                <div className="view-all-section">
                  <button className="view-all-btn" onClick={handleViewAll}>View All</button>
                </div>
              )}
            </div>
          )}

        </div>

      )}



      {review && (

        <div className="review-section">
          {page > 0 &&
            <button className="reset-btn" onClick={reset}>Reset Game</button>
          }
          {state.data && state.data.map((item, index) => (
            <div key={item.id} className="review-block">
              <p className="review-question">{`Q${index + 1}: ${item.question}`}</p>
              <div className="review-options-container">
                {item.options?.map((option, i) => {
                  const isCorrect = i === item.answerIndex;
                  const isSelected = ansArray[item.id] === i;
                  const isIncorrect = isSelected && !isCorrect;

                  return (
                    <div
                      key={i}
                      className={`option ${isCorrect ? 'correct-option' : ''} 
                ${isIncorrect ? 'incorrect-option' : ''}`}
                    >
                      <p>{i + 1}: {option}</p>
                    </div>
                  );
                })}
              </div>
              <p className="description">{item.description}</p>
            </div>
          ))}
        </div>

      )}
    </>
  );



}

export default App
