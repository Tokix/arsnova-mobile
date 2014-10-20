/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2014 The ARSnova Team
 *
 * ARSnova Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define('ARSnova.model.Feedback', {
	extend: 'Ext.data.Model',

	mixin: ['Ext.mixin.Observable'],

	config: {
		proxy: {type: 'restProxy'}
	},

	currentValues: [0, 0, 0, 0],
	currentAverage: null,

	constructor: function () {
		this.callParent(arguments);

		ARSnova.app.socket.addListener("arsnova/socket/feedback/update", function (values) {
			var count = this.currentValues.reduce(function (a, b) {
				return a + b;
			}, 0);
			this.currentAverage = Math.round((values[1] + values[2] * 2 + values[3] * 3) / count);
			this.currentValues = values;

			this.fireEvent("arsnova/session/feedback/count", count);
			this.fireEvent("arsnova/session/feedback/average", this.currentAverage);
			this.fireEvent("arsnova/session/feedback/update", this.currentValues);
		}, this);
	},

	getUserFeedback: function (sessionKeyword, callbacks) {
		/* TODO: Remove this method, it has been replaced by a WebSocket solution */
		console.warn("Deprecated method used for feedback");
		return this.getProxy().getUserFeedback(sessionKeyword, callbacks);
	},

	postFeedback: function (feedbackValue) {
		/* TODO: Use abstraction layer? */
		if (window.socket) {
			socket.emit("setFeedback", {value: feedbackValue});
		}
	}
});