<template>
    <div class="total-balance">
        <!-- <h2 class="title">TOTAL Balance2</h2>
        <div class="balance">
            <span>{{ crypto.value }} {{ crypto.symbol }}</span>
            <span class="almost-equal" >&#8776;</span>
            <span>{{ fiat.symbol }} {{ fiat.value }} </span>
        </div> -->

    </div>
</template>

<script>
export default {
    data() {
        return {
            crypto:{
                unit:"BTC",
                symbol:"BTC",
                value: 0
            },
            fiat: {
                unit:"DOLLAR",
                symbol:"$",
                value: 0
            }
        }
    }
}
</script>

<style lang="scss">
    @import '@/styles/variables.scss';

    .total-balance {
        display: flex;
        color: $titleColor;
        margin: 20px 0;

        h2.title {
            font-size: 24px;
            line-height: 27px;
        }

        .balance {
            display: flex;
            align-items: center;
            margin-left: 24px;
            font-size: 20px;
            line-height: 29px;
            .almost-equal {
                margin: 0 6px;
            }
        }
    }
</style>