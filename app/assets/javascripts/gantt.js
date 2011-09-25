var UTIL = {
    /* expected input: '2011-09-24T19:08:44Z' */
    cleanDate : function(dirtyDate) {
        var year,
            month,
            day,
            hour,
            minute;
    
        if (dirtyDate.length < 16) {
            return false;
        }
    
        year = dirtyDate.substr(0, 4);
        month = dirtyDate.substr(5, 2);
        day = dirtyDate.substr(8, 2);
        hour = dirtyDate.substr(11, 2);
        minute = dirtyDate.substr(14, 2);
    
        return Date(year, month, day, hour, minute);
    },
    diffDate: function(dateA, dateB) {
        var da, db, diffDate;
        //alert('DateA : ' + new Date(dateA));
        //alert('DateB : ' + new Date(dateB));
        
        da = new Date(dateA).getTime();
        db = new Date(dateB).getTime();
        alert(da + ' - ' + db);
        try {
            diffDate = da - db;
        } catch (e) {
            return false;
        }
        
        return diffDate;
    }
};

var UTIL = UTIL || {};

var tasks = [
    {
        expected_start: 0,
        expected_end: 300,
        actual_start: 50,
        actual_end: null
    },
    {
        expected_start: 50,
        expected_end: 200,
        actual_start: 50,
        actual_end: 200
    },
    {
        expected_start: 100,
        expected_end: 200,
        actual_start: 100,
        actual_end: 200
    },
    {
        expected_start: 300,
        expected_end: 500,
        actual_start: null,
        actual_end: null
    }
];

var real_tasks = [
    {
        "assigned_date": "2011-09-23T19:08:00Z",
        "closed_date": "",
        "created_at": "2011-09-24T19:08:44Z",
        "expectation_date": "2011-09-25T19:08:00Z",
        "id": 1,
        "name": "Test",
        "opened_date": "2011-09-23T19:08:00Z",
        "updated_at": "2011-09-24T19:08:44Z",
        "user_id": 1
    },
    {
        "assigned_date": "2011-09-24T19:34:00Z",
        "closed_date": "2011-09-28T19:34:00Z",
        "created_at": "2011-09-24T19:34:30Z",
        "expectation_date": "2011-09-28T19:34:00Z",
        "id": 2,
        "name": "werklgt;wjer",
        "opened_date": "2011-09-24T19:34:00Z",
        "updated_at": "2011-09-24T19:34:30Z",
        "user_id": 2
    },
    {
        "assigned_date": "2011-09-24T19:34:00Z",
        "closed_date": "2011-09-24T23:34:00Z",
        "created_at": "2011-09-24T20:47:00Z",
        "expectation_date": "2011-09-25T19:34:00Z",
        "id": 3,
        "name": "My First Task",
        "opened_date": "2011-09-24T19:34:00Z",
        "updated_at": "2011-09-24T20:48:45Z",
        "user_id": 3
    }
];


$(function() {
    var $div = $('.gantt'),
        i,
        taskLength = tasks.length,
        task,
        taskHtml,
        barCss,
        expectedCss,
        actualCss,
        now = 250;
    
    for (i = 0; i < taskLength; i++) {
        task = tasks[i];
        
        task.expected_duration = task.expected_end - task.expected_start;
        task.actual_duration = task.actual_end ? task.actual_end - task.actual_start : (task.actual_start ? now - task.actual_start : 0);
        task.overall_duration = task.expected_end > task.actual_end ? task.expected_duration : task.actual_end - task.expected_start;
        task.actual_offset = task.actual_start - task.expected_start;
        
        barCss = 'width:' + task.overall_duration;
        expectedCss = 'width:' + task.expected_duration + 'px;margin-left:' + task.expected_start + 'px';
        actualCss = 'width:' + task.actual_duration + 'px;left:' + task.actual_offset + 'px';
        
        taskHtml = '<div class="barWrap"><div id="bar_' + i + '" class="bar" style="' + barCss + '"><div class="expected" style="' + expectedCss + '"><div class="actual" style="' + actualCss + '"</div></div></div></div>';
        //alert(taskHtml);
        $div.append(taskHtml);
    }
    /*
    $( ".bar" ).draggable({
        axis: 'x',
        containment: '.barWrap',
        grid: [10, 0]
    });
    
    $( ".bar" ).resizable({
        handles: 'e, w',
        grid: [ 20, 0 ]
    });
    */
    $('.gantt').disableSelection();
    
    var realTaskLength = real_tasks.length,
        diffDate,
        real_task2,
        j;
    
    for (j = 0; j < realTaskLength; j++) {
        var real_task = {};
        real_task = real_tasks[j];
        
        alert(real_task.name + ' : ' + real_task.closed_date + ' - ' + real_task.assigned_date);
        real_task.assigned_date = UTIL.cleanDate(real_task.assigned_date);
        real_task.expectation_date = UTIL.cleanDate(real_task.expectation_date);
        real_task.opened_date = UTIL.cleanDate(real_task.opened_date);
        real_task.closed_date = UTIL.cleanDate(real_task.closed_date);
        
        if (real_task.closed_date) {
            //alert(real_task.closed_date + ' - ' + real_task.assigned_date);
        
            alert('This task took ' + ((new Date(real_task.closed_date).getTime(), new Date(real_task.assigned_date).getTime() / 1000) * 60 * 60) + ' hours to complete from assignment.');
        }
    }
});