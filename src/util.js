export default {
    methods: {
        go(idx) {
            debugger
            var url = `./m${idx}.html`;
            //window.location.href = "./m2.html";
            //return;
            if (window.api) {
                api.openWin({
                    name: 'm' + idx,
                    url
                });
            } else {
                window.location.href = url;
            }
        }
    }
}