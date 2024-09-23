import { db, collection, query, where, limit, getDocs, app, auth, doc, getDoc, updateDoc } from './firebaseInit.js'; // Ensure the path is correct

$(document).ready(function() {
        // Define your options
    const options = [
        { value: 'brachot', text: 'ברכות' },
        { value: 'shabat', text: 'שבת' },
        { value: 'eruvin', text: 'עירובין' },
        { value: 'pesahim', text: 'פסחים' },
        { value: 'yoma', text: 'יומא' },
        { value: 'sukkah', text: 'סוכה' },
        { value: 'beitza', text: 'ביצה' },
        { value: 'rosh hashana', text: 'ראש השנה' },
        { value: 'ta\'anit', text: 'תענית' },
        { value: 'megillah', text: 'מגילה' },
        { value: 'mo\'ed katan', text: 'מועד קטן' },
        { value: 'hagigah', text: 'חגיגה' },
        { value: 'yevamot', text: 'יבמות' },
        { value: 'ketubot', text: 'כתובות' },
        { value: 'nedarim', text: 'נדרים' },
        { value: 'nazir', text: 'נזיר' },
        { value: 'sotah', text: 'סוטה' },
        { value: 'gittin', text: 'גטין' },
        { value: 'kiddushin', text: 'קדושין' },
        { value: 'bava kama', text: 'בבא קמא' },
        { value: 'bava metzia', text: 'בבא מציעא' },
        { value: 'bava batra', text: 'בבא בתרא' },
        { value: 'sanhedrin', text: 'סנהדרין' },
        { value: 'makkot', text: 'מכות' },
        { value: 'shevu\'ot', text: 'שבועות' },
        { value: 'avoda zara', text: 'עבודה זרה' },
        { value: 'horayot', text: 'הוריות' },
        { value: 'zevahim', text: 'זבחים' },
        { value: 'menahot', text: 'מנחות' },
        { value: 'hullin', text: 'חולין' },
        { value: 'bekhorot', text: 'בכורות' },
        { value: 'arakhin', text: 'ערכין' },
        { value: 'temurah', text: 'תמורה' },
        { value: 'kreitot', text: 'כריתות' },
        { value: 'me\'ila', text: 'מעילה' },
        { value: 'tamid', text: 'תמיד' },
        { value: 'niddah', text: 'נדה' }
    ];

    // Populate the select element
    const selectElement = $('#masechet-select');

    options.forEach(option => {
        const optionElement = $('<option></option>').val(option.value).text(option.text);
        selectElement.append(optionElement);
    });

    // Optionally, handle the selection change
    selectElement.on('change', function() {
        var selectedOption = $(this).val();
        console.log('Selected option:', selectedOption);
        // Add more logic here if needed
    });

    // Add a click event listener to the start button
$('#send').off('click').on('click', async () => {
    const masechet = selectElement.find('option:selected').val();
    const from_daf = $('#from-daf').val();
    const to_daf = $('#to-daf').val();

    if (!validate(masechet, from_daf, to_daf)) {
        return;
    }

    // Get selected question types
    const selectedTypes = [];
    $('input[name="question-type"]:checked').each(function() {
        selectedTypes.push($(this).val());
    });

    if (selectedTypes.length === 0) {
        alert('בבקשה בחר לפחות סוג שאלה אחד.');
        return;
    }

    // Fetch questions based on selected types
    var questions = await askDB(masechet, selectedTypes, from_daf, to_daf);
    var shuffledQuestions = shuffleArray(questions);
    console.log(shuffledQuestions);

    if (questions.length > 0) {
        startQuiz(shuffledQuestions);

    } else {
        alert('לא נמצאו שאלות עבור התנאים הנבחרים.');
    }
});

// Function to fetch questions from the database
async function askDB(masechet, selectedTypes, from_daf, to_daf) {
    try {
        var questions = [];
        const questionsRef = collection(db, 'questions');

        let q; // Declare q outside the if-else blocks

if (!from_daf && !to_daf) {
    q = query(
        questionsRef,
        where("masechet", '==', masechet),
        where("type", 'in', selectedTypes),
        limit(10)
    );
} else if (!from_daf) {
    q = query(
        questionsRef,
        where("masechet", '==', masechet),
        where("type", 'in', selectedTypes),
        where("toDaf", '<=', hebrewToNumber(to_daf)),
        limit(10)
    );
} else if (!to_daf) {
    q = query(
        questionsRef,
        where("masechet", '==', masechet),
        where("type", 'in', selectedTypes),
        where("fromDaf", '>=', hebrewToNumber(from_daf)),
        limit(10)
    );
} else {
    q = query(
        questionsRef,
        where("masechet", '==', masechet),
        where("type", 'in', selectedTypes),
        where("fromDaf", '>=', hebrewToNumber(from_daf)),
        where("toDaf", '<=', hebrewToNumber(to_daf)),
        limit(10)
    );
}

console.log(masechet, selectedTypes);

const querySnapshot = await getDocs(q);


        if (querySnapshot.empty) {
            return [];
        }

        querySnapshot.forEach((doc) => {
            questions.push(doc.data());
        });
        return questions;
    } catch (error) {
        console.error("Error getting documents:", error);
        return [];
    }
}

// Function to start the quiz
function startQuiz(questions) {
    let currentQuestionIndex = 0;
    let score = 0;

    // Display the current question
    function displayQuestion() {
        const questionObject = questions[currentQuestionIndex];
        $('#question-text').text(questionObject.questionText);

        // Hide all displays initially
        $('#multiple-choice-question-display').hide();
        $('#open-question-display').hide();
        $('#true-false-question-display').hide();

        // Show the correct display based on the question type
        switch (questionObject.type) {
            case 'multiple-choice':
                displayMultipleChoice(questionObject);
                break;
            case 'open-question':
                displayOpenQuestion(questionObject);
                break;
            case 'true-false':
                displayTrueFalse(questionObject);
                break;
        }
    }

    // Function to check the user's answer and update the score
    function checkAnswer(userAnswer) {
        const currentQuestion = questions[currentQuestionIndex];
        let isCorrect = false;

        // Logic for checking the answer based on question type
        if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
            isCorrect = (userAnswer === currentQuestion.correctAnswer);
        } else if (currentQuestion.type === 'open-question') {
        console.log("leveblah2 score: " + blockMoveDistance(currentQuestion.correctAnswer, userAnswer))
            // Check if the answer matches any of the acceptable answers
            if (currentQuestion.acceptableAnswers.includes(userAnswer.trim())) {
                isCorrect = true;
            } else if (blockMoveDistance(currentQuestion.correctAnswer, userAnswer) < Math.max(currentQuestion.correctAnswer.split(' ').length, userAnswer.split(' ').length)/3) {
                isCorrect = true;
            } else {
                isCorrect = false;
            }
        }

        // Update the score if the answer is correct
        if (isCorrect) {
            score++;
        }

        // Show feedback to the user
        alert(isCorrect ? 'Correct!' : 'Incorrect! the Answer was: ' + currentQuestion.correctAnswer);

        // Move to the next question or finish the quiz
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(); // Show the next question
        } else {
            endQuiz(); // Finish the quiz
        }
    }

    async function endQuiz() {
    // Hide all displays
    $('#multiple-choice-question-display').hide();
    $('#open-question-display').hide();
    $('#true-false-question-display').hide();

    const user = auth.currentUser;

    if (user) {
        const userRef = doc(db, 'users', user.uid);

        try {
            // Fetch the current user data
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                // Get the user's current score
                const currentScore = userSnapshot.data().score || 0;

                // Calculate the new score (add the current quiz score)
                const newScore = currentScore + score;

                // Update the user's score in Firestore
                await updateDoc(userRef, { score: newScore });

                // Update the score in the header
                $('#user-score').text(`Score: ${newScore}`);

                alert(`Quiz finished! Your score: ${score}/${questions.length}`);
            } else {
                console.log('No such user document!');
            }
        } catch (error) {
            console.error('Error updating score: ', error);
        }
    } else {
        alert(`Quiz finished! Your score: ${score}/${questions.length}`);
        console.log('No user signed in.');
    }
}


    // Display the first question
    displayQuestion();

    // Add event listeners for the answer buttons
    $('#multiple-choice-question-display .button').on('click', function () {
        event.preventDefault();
        const selectedAnswer = $(this).text();
        checkAnswer(selectedAnswer);
    });

    $('#true-false-question-display .button').on('click', function () {
        event.preventDefault();
        const selectedAnswer = $(this).text();
        checkAnswer(selectedAnswer);
    });

    $('#open-question-submit').on('click', function () {
        event.preventDefault();
        const userAnswer = $('#answer-line').val();
        checkAnswer(userAnswer);
    });
}

});

function validate(masechet, from_daf, to_daf) {
    if (!masechet) {
        alert('בבקשה בחר מסכת.');
        return false;
    }
    try {
        hebrewToNumber(from_daf);
    } catch (error) {
        alert('בבקשה הזן דף תקף.');
        return false;
    }
    try {
        hebrewToNumber(to_daf);
    } catch (error) {
        alert('בבקשה הזן דף תקף.');
        return false;
    }
    if (hebrewToNumber(from_daf) > hebrewToNumber(to_daf)) {
        alert('הדף להתחלה אינו יכול להיות גדול מהדף לסיום.');
        return false;
    }
    return true;
}

function displayMultipleChoice(question) {
    // Hide the other displays
    $('#open-question-display').hide();
    $('#true-false-display').hide();

    // Show the multiple-choice display
    $('#multiple-choice-display').show();

    // Shuffle and display the answers
    var answers = shuffleArray(Object.keys(question.answers));
    $('#mc-answer1-button').text(answers[0]);
    $('#mc-answer2-button').text(answers[1]);
    $('#mc-answer3-button').text(answers[2]);
    $('#mc-answer4-button').text(answers[3]);

    // Update the question text
    $('#question-text').text(question.questionText);
}



    function displayOpenQuestion(question) {
    // Hide the other displays
    $('#multiple-choice-display').hide();
    $('#true-false-display').hide();

    // Show the open question display
    $('#open-question-display').show();

    // Display the question text and word bank
    $('#answer-line').val(''); // Clear the answer input
    $('#answer-line').prop('disabled', true); // Lock the answer box
    $('#word-bank').empty(); // Clear the word bank

    // Shuffle words: correct answer words + extra words
    var words = shuffleArray(question.correctAnswer.split(' ').concat(question.extraWords));

    // Create a button for each word and append it to the word bank
    words.forEach(word => {
        const wordButton = $('<button>')
            .text(word)
            .addClass('word-button')
            .on('click', function () {
                // Add the word to the answer line
                $('#answer-line').val((index, currentValue) => currentValue + ' ' + word);

                // Disable the button after it's clicked
                $(this).prop('disabled', true);
            });
        $('#word-bank').append(wordButton);
    });

    // Update the question text
    $('#open-question-text').text(question.questionText);
}



    function displayTrueFalse(question) {
    // Hide the other displays
    $('#multiple-choice-display').hide();
    $('#open-question-display').hide();

    // Show the true/false question display
    $('#true-false-question-display').show();

    // Update the question text
    $('#true-false-question-text').text(question.questionText);

    // Set the answer buttons
    $('#tf-answer1-button').text("True").show();
    $('#tf-answer2-button').text("False").show();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function blockMoveDistance(correctAnswer, userAnswer) {
    // Step 1: Get LCS results
        const { blocksCorrect, blocksUser, correctRemaining, userRemaining } = iterativeLCS(correctAnswer, userAnswer);

        // Combine blocks and remaining into correct and user answer blocks
        const correctAnswerBlocks = organizeSubstrings(correctAnswer, blocksCorrect, correctRemaining);
        const userAnswerBlocks = organizeSubstrings(userAnswer, blocksUser, userRemaining);

        // Step 2: Calculate Levenshtein distance on blocks
        const levDistance = levenshteinDistance(correctAnswerBlocks, userAnswerBlocks);

        return levDistance;
}

    // Function to find the LCS with indices
    function findLCSWithIndices(correctArray, userArray) {
        const correctLength = correctArray.length;
        const userLength = userArray.length;

        const lcsMatrix = Array(correctLength + 1).fill().map(() => Array(userLength + 1).fill(0));
        let longestLength = 0;
        let endCorrect = 0;
        let endUser = 0;

        for (let i = 1; i <= correctLength; i++) {
            for (let j = 1; j <= userLength; j++) {
                if (correctArray[i - 1].text === userArray[j - 1].text) {
                    lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1;
                    if (lcsMatrix[i][j] > longestLength) {
                        longestLength = lcsMatrix[i][j];
                        endCorrect = i;
                        endUser = j;
                    }
                }
            }
        }

        if (longestLength > 0) {
            const startCorrect = endCorrect - longestLength;
            const startUser = endUser - longestLength;
            const lcs = correctArray.slice(startCorrect, endCorrect);
            return { lcs, startCorrect, endCorrect, startUser, endUser };
        }

        return { lcs: [], startCorrect: -1, endCorrect: -1, startUser: -1, endUser: -1 };
    }

    // Function to iterate and get LCS blocks
        function iterativeLCS(correct, user) {
            let correctRemaining = getWordsWithIndices(correct);
            let userRemaining = getWordsWithIndices(user);

            const blocksUserIndices = [];
            const blocksCorrectIndices = [];

            while (correctRemaining.length > 0 && userRemaining.length > 0) {
                const { lcs, startCorrect, endCorrect, startUser, endUser } = findLCSWithIndices(correctRemaining, userRemaining);

                if (lcs.length === 0) break;

                blocksUserIndices.push({text: lcs.map(block => block.text).join(' '), index: startUser});
                blocksCorrectIndices.push({text: lcs.map(block => block.text).join(' '), index: startCorrect});

                correctRemaining = [
                    ...correctRemaining.slice(0, startCorrect),
                    ...correctRemaining.slice(endCorrect)
                ];
                userRemaining = [
                    ...userRemaining.slice(0, startUser),
                    ...userRemaining.slice(endUser)
                ];
            }

            return {
                blocksCorrect: blocksCorrectIndices,
                blocksUser: blocksUserIndices,
                correctRemaining: correctRemaining,
                userRemaining: userRemaining
            };
        }

    // Levenshtein distance function
        function levenshteinDistance(a, b) {
            const matrix = [];

            let i;
            for (i = 0; i <= b.length; i++) {
                matrix[i] = [i];
            }

            let j;
            for (j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
            }

            for (i = 1; i <= b.length; i++) {
                for (j = 1; j <= a.length; j++) {
                    if (b[i - 1] === a[j - 1]) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                    }
                }
            }

            return matrix[b.length][a.length];
        }

    function organizeSubstrings(string1, blocklist1, remainder1) {
            // Initialize empty list for the result
            const complete1 = [];

            // Combine blocklist1 and remainder1
            const substringsWithPositions = [...blocklist1, ...remainder1];

            // Sort the substrings by their position in string1
            substringsWithPositions.sort((a, b) => a.index - b.index);

            console.log(substringsWithPositions);
            // Extract the sorted substrings into the complete1 array
            substringsWithPositions.forEach(item => complete1.push(item.text));

            // Return the sorted list of substrings
            return complete1;
        }


    function getWordsWithIndices(text) {
            const words = [];
            let currentIndex = 0;

            text.split(' ').forEach(word => {
                const startIndex = text.indexOf(word, currentIndex);
                words.push({ text: word, index: startIndex });
                currentIndex = startIndex + word.length;
            });

            return words;
        }

// Mapping of Hebrew letters to their numeric values (Gematria)
const hebrewToNumberMap = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
};

// Reverse map for number to Hebrew letter conversion
const numberToHebrewMap = {
    400: 'ת', 300: 'ש', 200: 'ר', 100: 'ק',
    90: 'צ', 80: 'פ', 70: 'ע', 60: 'ס', 50: 'נ', 40: 'מ', 30: 'ל', 20: 'כ', 10: 'י',
    9: 'ט', 8: 'ח', 7: 'ז', 6: 'ו', 5: 'ה', 4: 'ד', 3: 'ג', 2: 'ב', 1: 'א'
};

// Function to convert Hebrew letters to an integer
function hebrewToNumber(hebrewStr) {
    let total = 0;
    for (let char of hebrewStr) {
        if (hebrewToNumberMap[char]) {
            total += hebrewToNumberMap[char];
        } else {
            throw new Error(`Invalid Hebrew character: ${char}`);
        }
    }
    return total;
}

// Function to convert an integer to Hebrew letters
function numberToHebrew(num) {
    if (num <= 0) {
        throw new Error("Number must be positive");
    }
    let result = '';
    const keys = Object.keys(numberToHebrewMap).map(Number).sort((a, b) => b - a); // Get keys in descending order
    for (let key of keys) {
        while (num >= key) {
            result += numberToHebrewMap[key];
            num -= key;
        }
    }
    return result;
}