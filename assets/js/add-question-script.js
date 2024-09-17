import { db, collection, addDoc } from './firebaseInit.js';

$(document).ready(function() {

    $('#question-type-select').on('change', function () {
    var selectedType = $(this).val();
    // Hide all forms
    $('.question-form').hide();
    // Show the selected form
    if (selectedType) {
        $('#' + selectedType + '-form').show();
    }
});

        // Define your options
    const options = [
        { value: 'berakhot', text: 'ברכות' },
        { value: 'shabbat', text: 'שבת' },
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


    // Add event listener for the checkbox
        $('#demo-copy').change(function() {
            if ($(this).is(':checked')) {
                // If checked, enable the input and set opacity to 1 (fully visible)
                $('#to-daf').prop('disabled', false).css('opacity', 1);
            } else {
                // If unchecked, disable the input and set opacity to 0.2
                $('#to-daf').prop('disabled', true).css('opacity', 0.2).val('');
            }
        });

    $('#send-multiple-choice-question').click(async function(event) {
    event.preventDefault();

    // Collect input values
    const masechet = $('#masechet-select').val();
    let fromDaf = $('#from-daf').val();
    let toDaf = $('#to-daf').val();
    const questionText = $('#question-text').val();
    const answer1 = $('#answer1-text').val();
    const answer2 = $('#answer2-text').val();
    const answer3 = $('#answer3-text').val();
    const answer4 = $('#answer4-text').val();
    const correctAnswer = $('input[name="correct-answer"]:checked').val(); // Get the selected correct answer
    console.log(correctAnswer);
    const includesMultiplePages = $('#demo-copy').is(':checked');

    // Validate the inputs (simple example, expand as needed)
    if (!masechet || !questionText || !answer1 || !answer2 || !answer3 || !answer4) {
        alert('Please fill in all fields.');
        return;
    }

    if (!includesMultiplePages) {toDaf=fromDaf;}


    // Prepare answers dictionary
    const answers = {
        [answer1]: correctAnswer === '1',
        [answer2]: correctAnswer === '2',
        [answer3]: correctAnswer === '3',
        [answer4]: correctAnswer === '4'
    };

    // Prepare data to be added to Firestore
    const questionData = {
        masechet: masechet,
        fromDaf: hebrewToNumber(fromDaf),
        toDaf: hebrewToNumber(toDaf),
        questionText: questionText,
        answers: answers, // Store answers as a dictionary
        includesMultiplePages: includesMultiplePages,
        timestamp: new Date()
    };

    try {
        // Add the question to the 'questions' subcollection within 'multiple-choice' document
        await addDoc(collection(db, 'questions', 'multiple-choice', 'questions'), questionData);
        alert('Question added successfully!');
        // Optionally, clear the form after submission
        //$('#add-question-form')[0].reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert('Failed to add the question.');
    }
});

    // When the "Add Open Question" button is clicked
    $('#send-open-question').click(async function (event) {
        event.preventDefault();

        // Collect input values
        const masechet = $('#masechet-select').val();
        const questionText = $('#open-question-text').val();
        const correctAnswer = $('#correct-answer').val();
        let fromDaf = $('#from-daf').val();
        let toDaf = $('#to-daf').val();
        const includesMultiplePages = $('#demo-copy').is(':checked');
        let acceptableAnswers = $('#acceptable-answers').val().split(',').map(answer => answer.trim()).filter(answer => answer.length > 0);

//        if (!fromDaf || isNaN(fromDaf)) {
//            fromDaf = "א";
//        }
//        if (!toDaf || isNaN(toDaf)) {
//            toDaf = "ת";
//        }
         if (!includesMultiplePages) {toDaf=fromDaf;}

        // Ensure the correct answer is included in the acceptable answers list
        if (!acceptableAnswers.includes(correctAnswer.trim())) {
            acceptableAnswers.push(correctAnswer.trim());
        }

        const extraWords = $('#extra-words').val().split(',').map(word => word.trim()).filter(answer => answer.length > 0);

        // Validate the inputs
        if (!masechet || !questionText || !correctAnswer) {
            alert('בבקשה מלא את כל השדות.');
            return;
        }

        // Prepare data to be added to Firestore
        const questionData = {
            masechet: masechet,
            type: 'open-question',
            questionText: questionText,
            correctAnswer: correctAnswer,
            acceptableAnswers: acceptableAnswers,
            extraWords: extraWords,
            fromDaf: hebrewToNumber(fromDaf),
            toDaf: hebrewToNumber(toDaf),
            includesMultiplePages: includesMultiplePages,
            timestamp: new Date()
        };

        try {
            // Add the question to Firestore
            await addDoc(collection(db, 'questions'), questionData);
            alert('שאלה פתוחה נוספה למאגר בהצלחה!');

            // Optionally, clear the form after submission
            $('#open-question-text').val('');
            $('#correct-answer').val('');
            $('#acceptable-answers').val('');
            $('#extra-words').val('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('היה כשל בהוספת השאלה.');
        }
    });

    // When the "Add True/False Question" button is clicked
    $('#send-true-false-question').click(async function (event) {
        event.preventDefault();

        // Collect input values
        const masechet = $('#masechet-select').val();
        const questionText = $('#true-false-question-text').val();
        const correctAnswer = $('#true-false-correct-answer').val();
        let fromDaf = $('#from-daf').val();
        let toDaf = $('#to-daf').val();
        const includesMultiplePages = $('#demo-copy').is(':checked');

        // Validate the inputs
        if (!masechet || !questionText || !correctAnswer) {
            alert('בבקשה מלא את כל השדות.');
            return;
        }

        if (!includesMultiplePages) {toDaf=fromDaf;}

        // Prepare data to be added to Firestore
        const questionData = {
            masechet: masechet,
            type: 'true-false',
            questionText: questionText,
            correctAnswer: correctAnswer === 'true', // Convert to boolean
            fromDaf: hebrewToNumber(fromDaf),
            toDaf: hebrewToNumber(toDaf),
            includesMultiplePages: includesMultiplePages,
            timestamp: new Date()
        };

        try {
            // Add the question to Firestore
            await addDoc(collection(db, 'questions'), questionData);
            alert('שאלת נכון או לא נכון נוספה בהצלחה!');

            // Optionally, clear the form after submission
            $('#true-false-question-text').val('');
            $('#true-false-correct-answer').val('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('היה כשל בהוספת השאלה.');
        }
    });
});

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
    if (!hebrewStr) {
    console.log("returned 1: " + hebrewStr )
        return 1;
    }
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



