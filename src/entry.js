
import Vue from 'vue';


const login1 = r => require.ensure([], () => r(require('./components/m1.vue')), 'm1')
const login2 = r => require.ensure([], () => r(require('./components/m2.vue')), 'm2')
const login3 = r => require.ensure([], () => r(require('./components/m3.vue')), 'm3')
const login4 = r => require.ensure([], () => r(require('./components/m4.vue')), 'm4')
const login5 = r => require.ensure([], () => r(require('./components/m5.vue')), 'm5')
const login6 = r => require.ensure([], () => r(require('./components/m6.vue')), 'm6')
const login7 = r => require.ensure([], () => r(require('./components/m7.vue')), 'm7')
const login8 = r => require.ensure([], () => r(require('./components/m8.vue')), 'm8')
const login9 = r => require.ensure([], () => r(require('./components/m9.vue')), 'm9')
const login10 = r => require.ensure([], () => r(require('./components/m10.vue')), 'm10')


new Vue({ el: '#app', render: function (h) { return h(login1) } })
new Vue({ el: '#app', render: function (h) { return h(login2) } })
new Vue({ el: '#app', render: function (h) { return h(login3) } })
new Vue({ el: '#app', render: function (h) { return h(login4) } })
new Vue({ el: '#app', render: function (h) { return h(login5) } })
new Vue({ el: '#app', render: function (h) { return h(login6) } })
new Vue({ el: '#app', render: function (h) { return h(login7) } })
new Vue({ el: '#app', render: function (h) { return h(login8) } })
new Vue({ el: '#app', render: function (h) { return h(login9) } })
new Vue({ el: '#app', render: function (h) { return h(login10) } })

if(module.hot) {
	module.hot.accept();
}
