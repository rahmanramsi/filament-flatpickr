import flatpickr from "flatpickr";
import ConfirmDate from "../../assets/flatpickr/dist/esm/plugins/confirmDate/confirmDate.js";
import MonthSelect from "../../assets/flatpickr/dist/esm/plugins/monthSelect/index.js";
import WeekSelect from "../../assets/flatpickr/dist/esm/plugins/weekSelect/weekSelect.js";
// import RangePlugin from "../../assets/flatpickr/dist/esm/plugins/rangePlugin.js";
export default function flatpickrDatepicker(args) {
    return {
        state: args.state,
        mode: 'light',
        attribs: args.attribs ?? {},
        packageConfig: args.packageConfig ?? {},
        fp: null,
        get darkStatus() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        },
        get getMode() {
            /*if (localStorage.getItem('theme')) {
                return localStorage.getItem('theme');
            }*/
            return this.darkStatus ? 'dark' : 'light';
        },
        init: function () {
            this.mode = localStorage.getItem('theme') || (this.darkStatus ? 'dark' : 'light')
            const config = {
                mode: this.attribs.mode,
                time_24hr: true,
                altFormat: 'F j, Y',
                disableMobile: true,
                initialDate: this.state,
                allowInvalidPreload: false,
                static: false,
                defaultDate: this.state,
                ...this.packageConfig,
                plugins: [new ConfirmDate({
                    confirmText: "OK",
                    showAlways: false,
                    theme: this.mode
                })],
            };
            if (this.getMode === 'dark') {
                let el = document.querySelector('#pickr-theme')
                if (el) {
                    el.href = this.attribs.darkThemeAsset;
                }
            }
            if (this.attribs.monthSelect) {
                config.plugins.push(new MonthSelect({
                    shorthand: false, //defaults to false
                    dateFormat: "F Y", //defaults to "F Y"
                    altInput: true,
                    altFormat: "F, Y", //defaults to "F Y"
                    theme: this.mode // defaults to "light"
                }))
            } else if (this.attribs.weekSelect) {
                config.plugins.push(new WeekSelect({}))
            }/* else if (this.attribs.rangePicker) {
                config.plugins.push(new RangePlugin({}))
            }*/
            this.fp = flatpickr(this.$refs.picker, config);
            this.fp.parseDate(this.state, this.packageConfig.dateFormat)
            window.addEventListener('dark-mode-toggled', e => {
                this.mode = e.detail;
                let href = '';
                if (this.mode == 'dark') {
                    href = this.attribs.darkThemeAsset;
                } else {
                    href = this.attribs.lightThemeAsset;
                }
                document.querySelector('#pickr-theme').href = href;
            })
        },
    }
}
