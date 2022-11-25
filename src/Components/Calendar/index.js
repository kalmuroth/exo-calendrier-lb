import React from 'react';
import moment from 'moment';
import './calendar.css';


export default class Calendar extends React.Component {
    state = {
        dateContext: moment(),
        selectedDate:moment(),
        today: moment(),
        showMonthPopup: false,
        showYearPopup: false,
        selectedDay: null,
        date: [],
        titre: [],
        commentaire: [],
        complet: []
    }
    
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.width = props.width || "350px";
        this.style = props.style || {};
        this.style.width = this.width; 
    }


    weekdays = moment.weekdays();
    weekdaysShort = moment.weekdaysShort();
    months = moment.months();

    handleChange(event) {
        this.setState({value: event.target.selectedDate});
      }
    
    handleSubmit(event) {
        this.state.titre.push(event.target[1].value)
        this.state.commentaire.push(event.target[2].value)
        this.state.date.push(this.state.selectedDate.format("DD/MM/YYYY"))
        this.state.complet.push(this.state.selectedDate.format("DD/MM/YYYY") + " " + event.target[1].value + " : " + event.target[2].value)
        this.forceUpdate()
        event.preventDefault();
    }

    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    day = () => {
        return this.state.dateContext.format("D");
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        return this.state.dateContext.get("date");
    }
    currentDay = () => {
        return this.state.dateContext.format("DD/MM/YYYY");
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
        return firstDay;
    }

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    nextYear = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "year");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextYear && this.props.onNextYear();
    }

    prevYear = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "year");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevYear && this.props.onPrevYear();
    }

    MonthNav = () => {
        return (
            <span className="label-month">
                {this.month() }
            </span>
        );
    }

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        });
    }


    YearNav = () => {
        return (
            <span className="label-month">
                {this.year()}
            </span>
        );
    }

    onDayClick = (e, day) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("date", day);        
        this.setState({
            selectedDay: day,
            selectedDate: dateContext
        }, () => {
            //console.log("SELECTED DAY: ", this.state.selectedDate);
        });
        this.props.onDayClick && this.props.onDayClick(e, this.state.dateContext);
    }

    render() {
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
                </td>
            );
        }

        let daysInMonth = [];
        let totalMessage = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let idDateContext = this.state.dateContext.set("date", d);
            if(this.state.date.includes(idDateContext.format("DD/MM/YYYY")) === true){
                daysInMonth.push(
                    <td id={idDateContext.format("DD/MM/YYYY")} className={"current-day"} key={d}>
                        <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
                    </td>
                );
            }
            else if(this.state.dateContext.format("DD/MM/YYYY") === this.state.selectedDate.format("DD/MM/YYYY")){
                daysInMonth.push(
                    <td id={idDateContext.format("DD/MM/YYYY")} className={"selected-day"} key={d}>
                        <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
                    </td>
                );
            }
            else{
                daysInMonth.push(
                    <td id={idDateContext.format("DD/MM/YYYY")} key={d} >
                        <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
                    </td>
                );
            }
        }
        if(this.state.complet.some(substring=>substring.includes(this.state.selectedDate.format("DD/MM/YYYY")))){
            this.state.complet.forEach(element => {if(element.includes(this.state.selectedDate.format("DD/MM/YYYY"))){totalMessage.push(
                <div key={"date"} className={"info"}>
                    {element}
                </div>
            );}})
        }


        var totalSlots = [...blanks, ...daysInMonth];
        var message = [...totalMessage];
        var uniq = [...new Set(message)];
        let rows = [];
        let cells = [];
        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });
        

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        })

        return (
            <div>
                <div className="calendar-container" style={this.style}>
                    <table className="calendar">
                        <thead>
                            <tr className="calendar-header">
                                <td colSpan="5">
                                </td>
                                <td colSpan="1" className="nav-month">
                                    <i className="prev fa fa-fw fa-chevron-left"
                                        onClick={(e)=> {this.prevMonth()}}>
                                    </i>
                                    <this.MonthNav />
                                    <i className="prev fa fa-fw fa-chevron-right"
                                        onClick={(e)=> {this.nextMonth()}}>
                                    </i>
                                    <i className="prev fa fa-fw fa-chevron-left"
                                        onClick={(e)=> {this.prevYear()}}>
                                    </i>
                                    <this.YearNav />
                                    <i className="prev fa fa-fw fa-chevron-right"
                                        onClick={(e)=> {this.nextYear()}}>
                                    </i>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {weekdays}
                            </tr>
                            {trElems}
                        </tbody>
                    </table> 
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <ul>
                                <li>
                                    <label for="date">Date:</label>
                                    <input type="text" id="date" name="date" value={this.state.selectedDate.format("DD/MM/YYYY")} onChange={this.handleChange}/>
                                </li>
                                <li>
                                    <label for="titre">Titre:</label>
                                    <input type="text" id="titre" name="titre"/>
                                </li>
                                <li>
                                    <label for="commentaire">Note:</label>
                                    <input type="text" id="commentaire" name="commentaire"></input>
                                </li>
                            </ul>
                            <input type="submit" value="Crée un rendez-vous" />
                        </form>
                    </div>
                </div>  
                <div className="commentary-container"> 
                    <div>
                        <table>
                            <a>
                                <td>Liste des rendez-vous</td>
                            </a>
                            <tr>
                                <td>Date/Titre/Commentaire</td>
                            </tr>
                            {uniq}
                        </table>
                    </div>
                </div>
            </div>   
        );
    }
}
