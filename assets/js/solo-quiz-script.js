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
});
