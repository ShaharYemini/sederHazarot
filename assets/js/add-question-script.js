import { db, collection, addDoc } from './firebaseInit.js';

$(document).ready(function() {
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

    $('#send').click(async function(event) {
    event.preventDefault();

    // Collect input values
    const masechet = $('#masechet-select').val();
    const fromDaf = $('#from-daf').val();
    const toDaf = $('#to-daf').val();
    const questionText = $('#question-text').val();
    const answer1 = $('#answer1-text').val();
    const answer2 = $('#answer2-text').val();
    const answer3 = $('#answer3-text').val();
    const answer4 = $('#answer4-text').val();
    const includesMultiplePages = $('#demo-copy').is(':checked');

    // Validate the inputs (simple example, expand as needed)
    if (!masechet || !fromDaf || !toDaf || !questionText || !answer1 || !answer2 || !answer3 || !answer4) {
        alert('Please fill in all fields.');
        return;
    }

    // Prepare data to be added to Firestore
    const questionData = {
        masechet: masechet,
        fromDaf: fromDaf,
        toDaf: toDaf,
        questionText: questionText,
        answers: [
            answer1,
            answer2,
            answer3,
            answer4
        ],
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

});