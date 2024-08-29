import { db, collection, query, where, limit, getDocs, app } from './firebaseInit.js'; // Ensure the path is correct

$(document).ready(function() {
        // Define your options
    const options = [
        { value: 'brachot', text: 'ברכות' },
        { value: '[!!! השמות האנגליים עדיין אינם כאן. לשקול שימוש במספרים]', text: 'שבת' },
        { value: 'geography', text: 'עירובין' },
        { value: 'kidushin', text: 'פסחים' },
        { value: 'history', text: 'יומא' },
        { value: 'geography', text: 'סוכה' },
        { value: 'kidushin', text: 'ביצה' },
        { value: 'history', text: 'ראש השנה' },
        { value: 'geography', text: 'תענית' },
        { value: 'kidushin', text: 'מגילה' },
        { value: 'history', text: 'מועד קטן' },
        { value: 'geography', text: 'חגיגה' },
        { value: 'brachot', text: 'יבמות' },
        { value: 'history', text: 'כתובות' },
        { value: 'geography', text: 'נדרים' },
        { value: 'kidushin', text: 'נזיר' },
        { value: 'history', text: 'סוטה' },
        { value: 'geography', text: 'גטין' },
        { value: 'kidushin', text: 'קדושין' },
        { value: 'history', text: 'בבא קמא' },
        { value: 'geography', text: 'בבא מציעא' },
        { value: 'kidushin', text: 'בבא בתרא' },
        { value: 'history', text: 'סנהדרין' },
        { value: 'geography', text: 'מכות' },
        { value: 'brachot', text: 'שבועות' },
        { value: 'history', text: 'עבודה זרה' },
        { value: 'geography', text: 'הוריות' },
        { value: 'kidushin', text: 'זבחים' },
        { value: 'history', text: 'מנחות' },
        { value: 'geography', text: 'חולין' },
        { value: 'kidushin', text: 'בכורות' },
        { value: 'history', text: 'ערכין' },
        { value: 'geography', text: 'תמורה' },
        { value: 'kidushin', text: 'כריתות' },
        { value: 'history', text: 'מעילה' },
        { value: 'geography', text: 'תמיד' },
        { value: 'math', text: 'נדה' }
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

    // Select the button using its ID
const button = document.getElementById('send');

// Add a click event listener to the button
button.addEventListener('click', async () => {
    // Code to execute when the button is clicked
    // Get the selected option

    // Get the selected option's text
    const from_dafElement = $('#from-daf');
    const to_dafElement = $('#to-daf');
    var masechet = selectElement.find('option:selected').text();
    var from_daf = from_dafElement.val();
    var to_daf = to_dafElement.val();
    if (validate(masechet, from_daf, to_daf) == false) {return;}
    var questions = await askDB(masechet);

    const questionTextElement = $('#question-text');
    const answer1Element = $('#answer1-button');
    const answer2Element = $('#answer2-button');
    const answer3Element = $('#answer3-button');
    const answer4Element = $('#answer4-button');
    var currentQuestionIndex = 0;
    startQuiz();

    function validate(masechet, from_daf, to_daf) {
    // להוסיף וידוא ערכים אמיתי
        console.log(masechet + from_daf + to_daf);
        return true;
    }
    async function askDB(masechet) {
        try {
        var questions = [];
        // Reference to the 'questions' collection
        const questionsRef = collection(db, 'questions');

        // Create a query with where condition and limit
        const q = query(
            questionsRef,
            where("masechet", '==', masechet), // Adjust the operator if needed
            limit(10) // Limit to 10 documents
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Process the results
        if (querySnapshot.empty) {
            console.log("No matching documents found.");
            return;
        }

        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
            questions.push(doc.data());
        });
        return questions;
    } catch (error) {
        console.error("Error getting documents:", error);
    }
    }
    function startQuiz() {
        displayQuestion();
    }

    function displayQuestion() {
    if (questions.length === 0) {
        document.getElementById('question-container').innerHTML = 'No questions available.';
        return;
    }

    if (currentQuestionIndex >= questions.length) {
        document.getElementById('question-container').innerHTML = 'Quiz complete!';
        document.getElementById('next-button').style.display = 'none';
        return;
    }

    const questionObject = questions[currentQuestionIndex];
    questionTextElement.text(questionObject.question);
    var answerDict = shuffleArray(questionObject.answers);
    let answers = Object.keys(answerDict);
    answer1Element.text(answers[0]);
    answer2Element.text(answers[1]);
    answer3Element.text(answers[2]);
    answer4Element.text(answers[3]);
    console.log(questionTextElement.textContent, questionObject.question);
    }

     function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
            return array;
        }



});

});
