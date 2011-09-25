
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

        return new Date(dirtyDate.substr(0, 4), dirtyDate.substr(5, 2), dirtyDate.substr(8, 2), dirtyDate.substr(11, 2), dirtyDate.substr(14, 2))

        year = dirtyDate.substr(0, 4);
        month = dirtyDate.substr(5, 2);
        day = dirtyDate.substr(8, 2);
        hour = dirtyDate.substr(11, 2);
        minute = dirtyDate.substr(14, 2);

        return new Date(year, month, day, hour, minute, 0, 0);
    },
    diffDate: function(dateA, dateB) {
        var da, db, diffDate;
        //alert('DateA : ' + new Date(dateA));
        //alert('DateB : ' + new Date(dateB));

        da = new Date(dateA).getTime();
        db = new Date(dateB).getTime();
        //alert(da + ' - ' + db);
        try {
            diffDate = da - db;
        } catch (e) {
            return false;
        }

        return diffDate;
    }
};

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
        "assigned_date": "2011-09-22T19:08:00Z",
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
        "closed_date": "2011-09-26T19:34:00Z",
        "created_at": "2011-09-24T19:34:30Z",
        "expectation_date": "2011-09-26T19:34:00Z",
        "id": 2,
        "name": "werklgt;wjer",
        "opened_date": "2011-09-24T19:34:00Z",
        "updated_at": "2011-09-24T19:34:30Z",
        "user_id": 2
    },
    {
        "assigned_date": "2011-09-23T19:34:00Z",
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
        assignCss,
        expectedCss,
        actualCss,
        realTaskLength = real_tasks.length,
        diffDate,
        real_task,
        dayHeaderHtml = "",
        today = Date.today(),
        start_day = new Date(today).addDays(-2),
        end_day = new Date(today).addDays(2),
        current_day = new Date(start_day).addDays(-1),
        $dayHeader = $('.dayHeaderContainer'),
        startPercent,
        assign_day,
        open_day,
        close_day,
        expect_day,
        assign_hourOffset,
        open_hourOffset,
        expect_hourOffset,
        close_hourOffset,
        present,
        scalePercent = 5*24*36000;

    /* iterate through tasks *
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
        $div.append(taskHtml);
    }
    */
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

    for (i = 0; i < 5; i++) {
        dayHeaderHtml += '<div class="dayHeader">' + current_day.addDays(1).getDayName() + '</div>';
    }

    $dayHeader.append(dayHeaderHtml);

    var now_date = new Date().getTime() / 3600000;
/*
    for (i = 0; i < realTaskLength; i++) {
        
        task = real_tasks[i];

        assign_day = new Date(Date.parse(task.assigned_date.substr(0, 10) + ' ' + task.assigned_date.substr(11, 8) ));
        open_day = new Date(Date.parse(task.opened_date.substr(0, 10) + ' ' + task.opened_date.substr(11, 8) ));
        close_day = new Date(Date.parse(task.closed_date.substr(0, 10) + ' ' + task.closed_date.substr(11, 8) ));
        expect_day = new Date(Date.parse(task.expectation_date.substr(0, 10) + ' ' + task.expectation_date.substr(11, 8) ));

        assign_hourOffset = (assign_day.getTime() - start_day.getTime()) / scalePercent;
        open_hourOffset = (open_day.getTime() - start_day.getTime()) / scalePercent;
        close_hourOffset = (close_day.getTime() - start_day.getTime()) / scalePercent;
        expect_hourOffset = (expect_day.getTime() - start_day.getTime()) / scalePercent;

        present = (today.getTime() - start_day.getTime()) / (5*24*36000);

        if (assign_hourOffset < 0) {
            assign_hourOffset = 0;
        }
        if (close_hourOffset < 0 || close_hourOffset > present) {
            close_hourOffset = present;
        }
        if (expect_hourOffset < 0 || expect_hourOffset > 100) {
            expect_hourOffset = 100;
        }

        barCss = 'width:' + task.overall_duration;
        assignCss = 'width:' + (open_hourOffset - assign_hourOffset) + '%;margin-left:' + assign_hourOffset + '%';
        actualCss = 'width:' + (close_hourOffset - open_hourOffset) + '%';
        expectedCss = 'width:' + (expect_hourOffset - close_hourOffset) + '%';

        taskHtml = '<div class="barWrap"><div id="bar_' + i + '" class="bar" style="' + barCss + '"><div class="assign" style="' + assignCss + '"></div><div class="actual" style="' + actualCss + '"></div><div class="expected" style="' + expectedCss + '"></div></div></div>';
        $div.append(taskHtml);
    }
    */
    present = (today.getTime() - start_day.getTime()) / (5*24*36000);

    $.getJSON('tasks.json', function(all_tasks){

        jQuery.fn.sort = function() {
    return this.pushStack( [].sort.apply( this, arguments ), []);
};

 function sortLastName(a,b){
     if (a.assigned_date == b.assigned_date){
       return 0;
     }
     return a.assigned_date< b.assigned_date ? 1 : -1;
 };
  function sortLastNameDesc(a,b){
     return sortLastName(a,b) * -1;
 };

var sorted=$(all_tasks).sort(sortLastNameDesc);


        $.each(sorted, function(i, task) {
            if (i > 8) {
                return false;
            }
            assign_day = new Date(Date.parse(task.assigned_date.substr(0, 10) + ' ' + task.assigned_date.substr(11, 8) ));
            open_day = new Date(Date.parse(task.opened_date.substr(0, 10) + ' ' + task.opened_date.substr(11, 8) ));
            close_day = new Date(Date.parse(task.closed_date.substr(0, 10) + ' ' + task.closed_date.substr(11, 8) ));
            expect_day = new Date(Date.parse(task.expectation_date.substr(0, 10) + ' ' + task.expectation_date.substr(11, 8) ));

            assign_hourOffset = (assign_day.getTime() - start_day.getTime()) / scalePercent;
            open_hourOffset = (open_day.getTime() - start_day.getTime()) / scalePercent;
            close_hourOffset = (close_day.getTime() - start_day.getTime()) / scalePercent;
            expect_hourOffset = (expect_day.getTime() - start_day.getTime()) / scalePercent;


            if (assign_hourOffset < 0) {
                assign_hourOffset = 0;
            }
            if (assign_hourOffset > present) {
                //assign_hourOffset = present;
            }
            if (open_hourOffset < assign_hourOffset) {
                open_hourOffset = assign_hourOffset;
            }
            if (open_hourOffset > present) {
                //open_hourOffset = present;
            }
            if (close_hourOffset < open_hourOffset) {
                close_hourOffset = open_hourOffset + 10;
            }
            if (close_hourOffset < 0 || close_hourOffset > present) {
                close_hourOffset = present;
            }
            if (close_hourOffset > expect_hourOffset) {
                close_hourOffset = expect_hourOffset;
            }
            if (expect_hourOffset < 0 || expect_hourOffset > 100) {
                expect_hourOffset = 100;
            }

            barCss = 'width:' + task.overall_duration;
            assignCss = 'width:' + (open_hourOffset - assign_hourOffset) + '%;margin-left:' + assign_hourOffset + '%';
            actualCss = 'width:' + (close_hourOffset - open_hourOffset) + '%';
            expectedCss = 'width:' + (expect_hourOffset - close_hourOffset) + '%';

            taskHtml = '<div class="barWrap"><div id="bar_' + i + '" class="bar" style="' + barCss + '"><div class="assign" style="' + assignCss + '"></div><div class="actual" style="' + actualCss + '"></div><div class="expected" style="' + expectedCss + '"></div></div></div>';
            $div.append(taskHtml);
        });


    });

});