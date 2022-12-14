'use strict';

window.addEventListener('DOMContentLoaded', () => {
    class Element {
        constructor(tag, selector, from, text = '') {
            this.tag = tag;
            this.selector = selector;
            this.from = from;
            this.text = text;
        }

        render() {
            const el = document.createElement(this.tag);
            el.classList = this.selector;
            this.from.append(el);
            el.innerHTML = `${this.text}`;
            return el;
        }
    }

    class Time {
        constructor() {
            this.currentDate = new Date();
            this.currentYear = this.currentDate.getFullYear();
            this.currentMonth = this.currentDate.getMonth();
            this.currentNumber = this.currentDate.getDate();
            this.indexDayOfWeek = this.currentDate.getDay();
            this.arrDaysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            this.arrMonthes = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
            this.currentDayOfWeek = this.getDayOfWeek(this.indexDayOfWeek);


        }

        getDayOfWeek(day) {
            switch(day) {
                case 0: return this.arrDaysOfWeek[6];
                case 1: return this.arrDaysOfWeek[0];
                case 2: return this.arrDaysOfWeek[1];
                case 3: return this.arrDaysOfWeek[2];
                case 4: return this.arrDaysOfWeek[3];
                case 5: return this.arrDaysOfWeek[4];
                case 6: return this.arrDaysOfWeek[5];
            }
        }


        getAmountLastDays(m, y) {
            let date = new Date(y, m, 1);
            switch(date.getDay()) {
                case 0: return 6;
                case 1: return 0;
                case 2: return 1;
                case 3: return 2;
                case 4: return 3;
                case 5: return 4;
                case 6: return 5;
            }
        }

        getDaysOfLastMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        getDaysOfMonth(month, year) {
            return new Date(year, month + 1, 0).getDate();
        }
    }

    const element = new Element();
    const time = new Time();


    const container = new Element('div', 'container', document.body,).render();
    const header = new Element('header', 'header', container).render();
    const title = new Element('h1', 'title', header, 'MyCalendar').render();
    const titleYear = new Element('h2', 'title-year', header, time.currentYear).render();
    const titleMonth = new Element('h2', 'title-month', header, time.arrMonthes[time.currentMonth]).render();
    const main = new Element('main', 'main', container).render();
    const titleDaysOfWeek = new Element('div', 'title-days', main).render();
    const slider = new Element('div', 'slider', main).render();
    const btnLeft = new Element('button', 'btn btn_left', slider, '<<<').render();
    const calendar = new Element('div', 'calendar', slider).render();
    const btnRight = new Element('button', 'btn btn_right', slider, '>>>').render();
    const pageLast = new Element('div', 'page-last', calendar).render();
    const page = new Element('div', 'page', calendar).render();
    const pageNext = new Element('div', 'page-next', calendar).render();

    let access = true;
    let arrLastDays = [];
    let arrNextDays = [];
    let arrCurrentDays = [];

    time.arrDaysOfWeek.forEach((day) => {
        const titleDay = new Element('div', 'title-day', titleDaysOfWeek, day).render();
    });

    let indexMonth = time.currentMonth;
    let indexYear = time.currentYear;

    function addLastDays(m, y, where) {
        let a = time.getDaysOfLastMonth(m, y) - time.getAmountLastDays(m, y);
        for(let i = 0; i < time.getAmountLastDays(m, y); i++) {
            new Element('div', 'day day_last', where, a + i + 1).render();
        }
    }

    function addCurrentDays(m, y, where) {
        let a = time.getDaysOfMonth(m, y);
        for(let i = 0; i < a; i++) {
            new Element('div', 'day day_current', where, i + 1).render();
        }
        arrCurrentDays = page.querySelectorAll('.day.day_current');
    }

    function addNextDays(m, y, where) {
        let a = 42 - (time.getAmountLastDays(m, y) + time.getDaysOfMonth(m, y));
        for(let i = 0; i < a; i++) {
            new Element('div', 'day day_next', where, i + 1).render();
        }
    }

    function decrease(m) {
        if(m === 0){
            indexMonth = 11;
            indexYear--;
        }
        else {
            indexMonth--;
        }
        titleYear.innerHTML = `${indexYear}`;
        titleMonth.innerHTML = `${time.arrMonthes[indexMonth]}`;
        addLastDays(indexMonth, indexYear, pageNext);
        addCurrentDays(indexMonth, indexYear, pageNext);
        addNextDays(indexMonth, indexYear, pageNext);
        pageNext.classList.add('from-right');
        page.classList.add('to-left');
        setTimeout(() => {
            pageNext.classList.remove('from-right');
            page.classList.remove('to-left');
            pageNext.innerHTML = '';
            page.innerHTML ='';
            addLastDays(indexMonth, indexYear, page);
            addCurrentDays(indexMonth, indexYear, page);
            addNextDays(indexMonth, indexYear, page);
        }, 1000);
    }

    function increase(m) {
        if(m === 11){
            indexMonth = 0;
            indexYear++;
        }
        else {
            indexMonth++;
        }
        titleYear.innerHTML = `${indexYear}`;
        titleMonth.innerHTML = `${time.arrMonthes[indexMonth]}`;
        addLastDays(indexMonth, indexYear, pageLast);
        addCurrentDays(indexMonth, indexYear, pageLast);
        addNextDays(indexMonth, indexYear, pageLast);
        pageLast.classList.add('from-left');
        page.classList.add('to-right');
        setTimeout(() => {
            pageLast.classList.remove('from-left');
            page.classList.remove('to-right');
            pageLast.innerHTML = '';
            page.innerHTML ='';
            addLastDays(indexMonth, indexYear, page);
            addCurrentDays(indexMonth, indexYear, page);
            addNextDays(indexMonth, indexYear, page);
        }, 1000);
    }
    
    addLastDays(time.currentMonth, time.currentYear, page);
    addCurrentDays(indexMonth, indexYear, page);
    addNextDays(indexMonth, indexYear, page);

    btnLeft.addEventListener('click', () => {
        if(access) {
            decrease(indexMonth);
            arrNextDays = pageNext.querySelectorAll('.day.day_current');
            if(indexMonth === time.currentMonth && indexYear === time.currentYear) {
                createCurrentDay(arrNextDays);
            }
        }
        else {
            return;
        }
        access = false;
        setTimeout(() => {
            access = true;
            if(indexMonth === time.currentMonth && indexYear === time.currentYear) {
                createCurrentDay(arrCurrentDays);
            }
        }, 1000);
        
    });
    btnRight.addEventListener('click', () => {
        if(access) {
            increase(indexMonth);
            arrLastDays = pageLast.querySelectorAll('.day.day_current');
            if(indexMonth === time.currentMonth && indexYear === time.currentYear) {
                createCurrentDay(arrLastDays);
            }
        }
        else {
            return;
        }
        access = false;
        setTimeout(() => {
            access = true;
            if(indexMonth === time.currentMonth && indexYear === time.currentYear) {
                createCurrentDay(arrCurrentDays);
            }

        }, 1000);
        
    });

    function createCurrentDay(from) {
        from.forEach((day, i) => {
            if(+day.innerHTML === time.currentNumber) {
                day.style.background = 'blue';
                
            }
        });
    }
    
    createCurrentDay(arrCurrentDays);
    
    calendar.addEventListener('click', (event) => {
        if(event.target.classList.contains('day_last')) {
            decrease(indexMonth);
        }
        if (event.target.classList.contains('day_next')) {
            increase(indexMonth);
        }
    });
});
