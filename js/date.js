// Various date time functions
// require: none
"use strict";

var SC = window.SC || {}

SC.date = (function () {
    var self = {};

    self.date = function (aDate) {
        // convert string or date to date, if aDate is undefined use current
        if (!aDate) {
            return new Date();
        }
        return new Date(aDate);
    };

    self.pad = function (aValue, aLength) {
        // prepend zeros to value
        return ('0000' + aValue).substr(aLength ? -aLength : -2);
    };

    self.dd = function (aDate) {
        // return date as 15th, 31st
        var dd, a;
        a = self.date(aDate);
        dd = a.getDate();
        switch (dd) {
        case 1:
            return dd + 'st';
        case 2:
            return dd + 'nd';
        case 3:
            return dd + 'rd';
        default:
            return dd + 'th';
        }
    };

    self.leap = function (aDateOrYear) {
        // return true if parameter is leap year or date in leap year
        var year = typeof aDateOrYear === 'number' ? aDateOrYear : self.yyyy(aDateOrYear);
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    };

    self.yyyymmdd = function (aDate) {
        // return date in yyyy-mm-dd format
        var yyyy, mm, dd, a;
        a = self.date(aDate);
        yyyy = a.getFullYear().toString();
        mm = (a.getMonth() + 1).toString(); // getMonth() is zero-based
        dd = a.getDate().toString();
        return yyyy + '-' + self.pad(mm, 2) + '-' + self.pad(dd, 2);
    };

    self.yyyymm = function (aDate) {
        // return month in yyyy-mm format
        var yyyy, mm, a;
        a = self.date(aDate);
        yyyy = a.getFullYear().toString();
        mm = (a.getMonth() + 1).toString(); // getMonth() is zero-based
        return yyyy + '-' + self.pad(mm, 2);
    };

    self.yyyy = function (aDate) {
        // return full year
        var a = self.date(aDate);
        return a.getFullYear();
    };

    self.hhmm = function (aDate) {
        // return time in HH:MM format
        var hh, mm, a;
        a = self.date(aDate);
        hh = a.getHours().toString();
        mm = a.getMinutes().toString();
        return self.pad(hh, 2) + ':' + self.pad(mm, 2);
    };

    self.hhmmss = function (aDate) {
        // return time in HH:MM:SS format
        var hh, mm, ss, a;
        a = self.date(aDate);
        hh = a.getHours().toString();
        mm = a.getMinutes().toString();
        ss = a.getSeconds().toString();
        return self.pad(hh, 2) + ':' + self.pad(mm, 2) + ':' + self.pad(ss, 2);
    };

    self.normal = function (aDate, aSeparator) {
        // return date as "yyyy.mm.dd HH:MM:SS"
        var a = self.date(aDate);
        a = self.yyyymmdd(a) + ' ' + self.hhmmss(a);
        if (aSeparator) {
            a = a.replace(/ /g, aSeparator + aSeparator);
            a = a.replace(/-/g, aSeparator);
            a = a.replace(/:/g, aSeparator);
        }
        return a;
    };

    self.iso = function (aDate) {
        // return yyyy-mm-ddTHH:MM:SS
        return self.normal(aDate).replace(' ', 'T');
    };

    self.file = function (aDate) {
        // return yyyy-mm-dd--HH-MM-SS
        return self.normal(aDate).replace(' ', '--').replace(/\:/g, '-');
    };

    self.human = function (aDate) {
        // show date as time if today, date if elsewhere
        var a = self.date(aDate), ymd, ymda;
        ymd = self.yyyymmdd(new Date());
        ymda = self.yyyymmdd(aDate);
        // today show only date
        if (ymd === ymda) {
            return self.hhmmss(a);
        }
        // for dates other than today only show date
        return ymda;
    };

    self.dowName = function (aDate, aLanguage) {
        // return name for day of the week (e.g. "Monday")
        var d = new Date(aDate || new Date()), dow;
        dow = {
            "en": ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            "sk": ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota']
        };
        return dow[aLanguage || 'en'][d.getDay()];
    };

    self.calendar = function (aDate, aLanguage) {
        // return "Monday 31st December" supported languages are: en, sk
        aLanguage = aLanguage || "en";
        var d = new Date(aDate || new Date()), day, mon;
        day = d.getDate();
        mon = {
            "en": ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            "sk": ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December']
        };
        mon = mon[aLanguage][d.getMonth()];
        switch (aLanguage) {
        case "en":
            return self.dowName(aDate, aLanguage) + ' ' + self.dd(d) + ' ' + mon;
        case "sk":
            return self.dowName(aDate, aLanguage) + ' ' + day + '. ' + mon;
        }
    };

    self.daysBetween = function (aThen, aNow) {
        // return approximate interval in days between 2 dates, ignores DST and leap years
        var oneDay = 24 * 60 * 60 * 1000,
            firstDate = new Date(aThen),
            secondDate = new Date(aNow || (new Date()));
        return Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay);
    };

    self.epoch = function () {
        // return number of whole days since 2017-11-01
        return Math.floor(self.daysBetween(new Date('2017-11-01')));
    };

    self.yesterday = function () {
        // return yesterday
        var d = new Date();
        d.setDate(d.getDate() - 1);
        return d;
    };

    return self;
}());
