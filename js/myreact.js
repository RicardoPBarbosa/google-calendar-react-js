var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Month(year, month, dates){
	this.date = new Date(year,month,0);
	this.numberofdays = this.date.getDate();
	this.numberofmonth = this.date.getMonth();
	this.nameofmonth = MonthNames[this.date.getMonth()];
	this.firstday = 1;
	this.year = this.date.getFullYear();
	this.calendar = generateCalendar(this.numberofdays, year, month-1, this.firstday, dates);
}

function Date2Day(year, month, day){
	return (new Date(year,month,day)).getDay();
}

function generateCalendar(numberofdays, year, month, day, dates){
	var WEEKDAY = daysOfWeek[Date2Day(year,month,day)];
	if(WEEKDAY in dates){
		dates[WEEKDAY].push(day);
	}else{
		dates[WEEKDAY] = [day];
	}
	day++;
	return day > numberofdays ? dates : generateCalendar(numberofdays, year, month, day, dates);
}
// to add a zero to the time when this is less than 10
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

var Calendar = React.createClass({
	getInitialState: function(){return this.generateCalendar()},
	generateCalendar: function(){
		var today = new Date();
		var present = new Date();
		var month = {};
		var entries = [];
		month = new Month(today.getFullYear(), today.getMonth() + 1, month);
		return {dates:month, today:today, entry:'+', present:present, entries:entries};
	},
	update: function(direction){
		var month = {};
		if(direction == "left"){
			month = new Month(this.state.dates.date.getFullYear(), this.state.dates.date.getMonth(), month);
		}else{
			month = new Month(this.state.dates.date.getFullYear(), this.state.dates.date.getMonth() + 2, month);
		}
		this.state.currDay = "";
		this.state.currMonth = "";
		this.state.currYear = "";
		$(".float").removeClass('rotate');
		return this.setState({dates:month});
	},
	selectedDay: function(day){
		this.state.warning = "";
		var selected_day = new Date();
		selected_day.setDate(day);
		var currentMonth = this.state.dates.nameofmonth;
		var currentMonthN = this.state.dates.numberofmonth;
		var currentYear = this.state.dates.date.getFullYear();
		return this.setState({today:selected_day, entry:'+', currDay:day, currMonth:currentMonth, currYear:currentYear, currMonthN:currentMonthN});
	},
	addEntry: function(day){
		if(this.state.currDay){
			if($(".float").hasClass('rotate')){
				$(".float").removeClass('rotate');
				$("#add_entry").addClass('animated slideOutDown');
				window.setTimeout( function(){
	                $("#add_entry").css('display','none');
	            }, 400);
				$("#entry_name").val("");
			}else{
				$(".float").addClass('rotate');
				$("#add_entry").removeClass('animated slideOutDown');
				$("#add_entry").addClass('animated slideInUp');
				$("#add_entry").css('display', 'block');
				window.setTimeout( function(){
	                $("#entry_name").focus();
	            }, 400);

			}
		}else{
			return this.setState({warning:"Select a day to make an entry!"});
		}
	},
	saveEntry: function(year, month, day){
		var entryName = $("#entry_name").val();
		var entryTime = new Date();
		var entryDate = {year,month,day};
		var entry = {entryName,entryDate,entryTime};
		if(entry != ''){
			this.state.entries.push(entry);
			// clean and close entry page
			$(".float").removeClass('rotate');
			$("#add_entry").addClass('animated slideOutDown');
			window.setTimeout( function(){
	            $("#add_entry").css('display','none');
	        }, 400);
			$("#entry_name").val("");

			return this.setState({entries: this.state.entries});
		}
		
	},
	render: function(){
		var calendar = [];
		for(var property in this.state.dates.calendar){
			calendar.push(this.state.dates.calendar[property])
		}
		var weekdays = Object.keys(this.state.dates.calendar);
		var done = false;
		var count = 0;
		return(
			<div>
				<div id="calendar">
					<div id="header">
						<i className="fa fa-bars" aria-hidden="true"></i>
						<p>{this.state.dates.nameofmonth} {this.state.dates.year}</p>
						<i className="fa fa-calendar" aria-hidden="true"></i>
						<i className="fa fa-search" aria-hidden="true"></i>
					</div>
					<div id="add_entry">
						<div className="enter_entry">
							<input type="text" placeholder="Entry name" id="entry_name" />
							<span id="save_entry" onClick={this.saveEntry.bind(null, this.state.currYear, this.state.currMonth, this.state.currDay)}>SAVE</span>
						</div>
					</div>
					<div id="arrows">
						<i className="fa fa-arrow-left" aria-hidden="true" onClick={this.update.bind(null,"left")}></i>
						<i className="fa fa-arrow-right" aria-hidden="true" onClick={this.update.bind(null,"right")}></i>
					</div>
					<div id="dates">
						{calendar.map(function(week, i){
							return (
								<div key={i}>
									<p className="weekname">{weekdays[i].substring(0,3)}</p>
									<ul>
										{week.map(function(day, k){
											var existEntry = {};
											{this.state.entries.map(function(entry, e){
												if(entry.entryDate.day == day && entry.entryDate.month == this.state.dates.nameofmonth && entry.entryDate.year == this.state.dates.year){
													existEntry = {borderWidth:"2px", borderStyle:"solid", borderColor:"#8DBEDE"};
													return;
												}
											}.bind(this))}
											return <li className={day === this.state.today.getDate() ? "today" : null} key={k} style={existEntry} onClick={this.selectedDay.bind(null, day)}>{day}</li>
										}.bind(this))}
									</ul>
								</div>
							)
						}.bind(this))}
					</div>
							
					{this.state.warning ? 
						<div className="warning">
							{this.state.warning}
						</div>
					: null }
					<div id="ignoreOverflow"><button className="float" onClick={this.addEntry.bind(null, this.state.today.getDate())}>{this.state.entry}</button></div>
				</div>
				{this.state.currDay ? 
					<div id="entries">
						<div className="contain_entries">
							<div id="entries-header">
								<p className="entryDay">{this.state.currDay} {this.state.currMonth}</p>
								{this.state.present.getDate() === this.state.currDay && this.state.present.getMonth() === this.state.currMonthN && this.state.present.getFullYear() === this.state.currYear ? <p className="currday">TODAY</p> : null}
							</div>
							{this.state.entries != '' ?
								<div>
									{this.state.entries.reverse().map(function(entry, e){
										count++;
										var entryFromThisDate = (entry.entryDate.day === this.state.currDay && entry.entryDate.month === this.state.currMonth && entry.entryDate.year === this.state.currYear ? true : false);
										if(entryFromThisDate){
											// prevent the "no-entries" div to appear in the next entries that are not from this day
											done = true;
											return (
												<div id="entry" key={e}>
													<div>
														<p className="entry_event">{entry.entryName}</p>
														<p className="entry_time">{entry.entryTime.getDate()} {MonthNames[entry.entryTime.getMonth()]} {entry.entryTime.getFullYear()} {addZero(entry.entryTime.getHours())}:{addZero(entry.entryTime.getMinutes())}</p>
													</div>
												</div>
											)
										}
										if(count === this.state.entries.length){
											if(!done){
												done = true;
												return (
													<div className="no-entries" key={e}>
														<i className="fa fa-calendar-check-o" aria-hidden="true"></i>
														<span>No events planned for today</span>
													</div>
												)
											}
										}
									}.bind(this))}
								</div>
							: 	<div className="no-entries">
									<i className="fa fa-calendar-check-o" aria-hidden="true"></i>
									<span>No events planned for today</span>
								</div>
							}
						</div>
					</div>
				: null}
			</div>
		)
	}
})
ReactDOM.render(<Calendar />, document.getElementById("app"));

// jQuery functions

(function($, undefined) {
  function hypot(x, y) { return Math.sqrt((x * x) + (y * y)); }

  $("button").each(function(el) {
    var self = $(this),
        html = self.html();

    self.html("").append($('<div class="btn"/>').html(html));
  })
  .append($('<div class="ink-visual-container"/>').append($('<div class="ink-visual-static"/>')))

  .on("mousedown touchstart", function(evt) {
    event.preventDefault();
    
    var self = $(this),
        container = self.find(".ink-visual-static", true).eq(0);

    if(!container.length) return;

    container.find(".ink-visual").addClass("hide");
    
    var rect = this.getBoundingClientRect(),
        cRect = container[0].getBoundingClientRect(),
        cx, cy, radius, diam;

        if (event.changedTouches) {
          cx = event.changedTouches[0].clientX;
          cy = event.changedTouches[0].clientY;
        }
        else {
          cx = event.clientX;
          cy = event.clientY;
        }

    if(self.is(".float")) {
      var rx = rect.width / 2,
          ry = rect.height / 2,
          br = (rx + ry) / 2,
          mx = rect.left + rx,
          my = rect.top + ry;

      radius = hypot(cx - mx, cy - my) + br;
    }
    diam = radius * 2;
        
    var el = $('<div class="ink-visual"/>').width(diam).height(diam)
    .css("left", cx - cRect.left - radius).css("top", cy - cRect.top - radius)
    
    .on("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function() {
      var self2 = $(this);

      switch(event.animationName) {
        case "ink-visual-show":
          if (self.is(":active")) self2.addClass("shown");
          break;

        case "ink-visual-hide":
          self2.remove();
          break;
      }
    })
    
    .on("touchend", function() { event.preventDefault(); });

    container.append(el);
  });

  $(window).on("mouseup touchend", function(evt) {
    $(".ink-visual-static").children(".ink-visual").addClass("hide");
  })
  .on("select selectstart", function(evt) { event.preventDefault(); return false; });
}(jQuery))
