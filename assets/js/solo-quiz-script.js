import { db, collection, query, where, limit, getDocs, app } from './firebaseInit.js'; // Ensure the path is correct

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
            // Reference to the specific document in the 'questions' collection
            const questionsRef = collection(db, 'questions', 'multiple-choice', 'questions');

            // Create a query with where condition and limit
            const q = query(
                questionsRef,
                //where("masechet", '==', masechet), // Filter by masechet
                limit(10)                          // Limit to 10 documents
            );

            // Execute the query
            const querySnapshot = await getDocs(q);

            // Process the results
            if (querySnapshot.empty) {
                console.log("No matching documents found.");
                return [];
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
        //document.getElementById('question-container').innerHTML = 'No questions available.';
        return;
    }

    if (currentQuestionIndex >= questions.length) {
        // document.getElementById('question-container').innerHTML = 'Quiz complete!';
        document.getElementById('next-button').style.display = 'none';
        return;
    }

    const questionObject = questions[currentQuestionIndex];
    questionTextElement.text(questionObject.questionText);
    var answers = shuffleArray(questionObject.answers);
    answer1Element.text(answers[0]);
    answer2Element.text(answers[1]);
    answer3Element.text(answers[2]);
    answer4Element.text(answers[3]);
    console.log(questionTextElement.text(), questionObject.questionText);
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
