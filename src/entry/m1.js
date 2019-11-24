
import Vue from 'vue';
import app from '../components/m1.vue'


if(__DEV__) {
	new (require("vconsole"))();
} 

window.apiready = function() {
	alert(api)

}
new Vue({
	el: '#app',
	render: function (h) {
		return h(app)
	}
})
/*
if(module.hot) {
	module.hot.accept();
}
*/


