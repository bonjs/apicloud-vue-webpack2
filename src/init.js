
import Vue from 'vue';

function init(App) {

	if (__DEV__) {
		new (require("vconsole"))();
	}

	var readyPromise = window.ready = new Promise(function (resolve, reject) {

		if (typeof api == 'object') {
			resolve();
			return;
		}

		window.apiready = function () {
			resolve();
		}
	});


	App.created = function () {
		var originCreated = App.created;
		var isAPICloud = /APICloud/.test(navigator.userAgent);

		return async function () {
			originCreated && originCreated.apply(this, arguments);
			isAPICloud && await readyPromise;
			App.init && App.init.apply(this);
		};
	}();

	new Vue({
		el: '#app',
		render: function (h) {
			return h(App)
		}
	})

}

export default init;