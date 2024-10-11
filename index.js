import countdown from 'countdown';

export default function (Alpine) {

	Alpine.data('countdown', ( settings = {
		date: 'now',
		long: true,
		d: 0,
		h: 1,
		m: 1,
		s: 1
	} ) => {
		let plugin;

		return {
			days: settings.d,
			hours: settings.h,
			minutes: settings.m,
			seconds: settings.s,

			init() {
				this.update( settings.date );
			},

			update( timestamp ) {
				const _this = this;

				const date = new Date( timestamp );

				window.clearInterval( plugin );

				plugin = countdown( (timespan) => {
					_this.days = timespan.days;
					_this.hours = timespan.hours;
					_this.minutes = timespan.minutes;
					_this.seconds = timespan.seconds;
				}, date, countdown.DAYS|countdown.HOURS|countdown.MINUTES|countdown.SECONDS );
			},

			get labels() {
				return {
					days: settings.long ? pluralize( this.days, 'day', 'days') : pluralize( this.days, 'd', 'd'),
					hours: settings.long ? pluralize( this.hours, 'hour', 'hours') : pluralize( this.days, 'h', 'h'),
					minutes: settings.long ? pluralize( this.minutes, 'minute', 'minutes') : pluralize( this.days, 'm', 'm'),
					seconds: settings.long ? pluralize( this.seconds, 'second', 'seconds') : pluralize( this.days, 's', 's'),
				}
			},

			get time() {
				return {
					days: leadingZero( this.days ),
					hours: leadingZero( this.hours ),
					minutes: leadingZero( this.minutes ),
					seconds: leadingZero( this.seconds),
				}
			},

			get show() {
				const showDays = this.days > 0;
				const showHours = this.hours > 0 || showDays;
				const showMinutes = this.minutes > 0 || showHours;
				const showSeconds = this.seconds > 0 || showMinutes;

				return {
					days: showDays,
					hours: showHours,
					minutes: showMinutes,
					seconds: showSeconds
				}
			}
		}
	});
}

const leadingZero = ( n ) => {
	let number = n.toString();
	while (number.length < 2 ) {
		number = "0" + number;
	}
	return number;
}

const pluralize = (val, word, plural = word + 's') => {
	const _pluralize = (num, word, plural = word + 's') =>
		[1, -1].includes(Number(num)) ? word : plural;
	if (typeof val === 'object') return (num, word) => _pluralize(num, word, val[word]);
	return _pluralize(val, word, plural);
};
