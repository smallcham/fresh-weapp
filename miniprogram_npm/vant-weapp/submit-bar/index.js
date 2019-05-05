import { VantComponent } from '../common/component';
import { iphonex } from '../mixins/iphonex';
VantComponent({
    mixins: [iphonex],
    classes: [
        'bar-class',
        'price-class',
        'button-class'
    ],
    props: {
        tip: null,
        type: Number,
        price: null,
        label: String,
        blabel:String,
        llabel:String,
        loading: Boolean,
        disabled: Boolean,
        buttonText: String,
        currency: {
            type: String,
            value: '¥'
        },
        buttonType: {
            type: String,
            value: 'danger'
        },
        mb: {
          type: String,
          value: '0rpx'
        }
    },
    computed: {
        hasPrice() {
            return typeof this.data.price === 'number';
        },
        hasBottomLabel() {
          return typeof this.data.blabel === 'string';
        },
        hasLeftLabel() {
          return typeof this.data.llabel === 'string';
        },
        priceStr() {
            return (this.data.price / 100).toFixed(1);
        },
        tipStr() {
            const { tip } = this.data;
            return typeof tip === 'string' ? tip : '';
        }
    },
    methods: {
        onSubmit(event) {
            this.$emit('submit', event.detail);
        }
    }
});
