<template>
  <div class="assets">
    <el-card class="box-card full">
      <ul v-if="assetsCount" class="asset-list">
        <li v-for="finance in finances" v-bind:key="finance.txHash">
          <svg-icon :icon-class="`logo-${iconSymbol.toLowerCase()}`" />
          <div class="asset-content">
            <div class="asset-header">
              <span class="asset-balance"
                >{{ showBudget(finance.budget) }} {{ orgAsset.symbol }}</span
              >
              <tag v-if="finance.isHost" text="Host" />
              <tag v-for="(t, index) in finance.tags" :text="t" :key="index" />
            </div>
            <div class="asset-address">{{ finance.address }}</div>
          </div>

          <router-link
            v-if="finance.budget > 0"
            class="assign-token"
            :to="{ name: 'assign-token', params: { id: finance.id } }"
          >
            <cu-button class="btn-assign-token" text="Assign token" />
          </router-link>

          <cu-button
            v-else
            class="assign-token btn-assign-token"
            text="Assign token"
            disabled="true"
          />
        </li>
      </ul>

      <h4 v-else class="message">
        Adding assets by
        <router-link :to="{ name: 'token-manager' }" class="link"
          >publishing token.</router-link
        >
      </h4>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Tag, Button as CuButton } from '@/components/Common'
import GetInfo from '@/mixins/GetInfo'
export default {
  components: {
    Tag,
    CuButton
  },
  mixins: [GetInfo],
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  data() {
    return {
      orgAsset:{},
      iconSymbol:'eth',
      decimal: 3,
      finances:[{}],
      assets: [
        {
          id: '1',
          symbol: 'eth',
          address: '0x123',
          isHost: true,
          balance: 0,
          tags: []
        },
        {
          id: '2',
          symbol: 'eth',
          address: '0x1234',
          isHost: false,
          balance: 100,
          tags: ['Salary Wallet']
        }
      ]
    }
  },
  watch: {
    'orgForm.finance': {
      handler(val,oldval) {
        this.finances = val
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.orgInfo = this.orgForm

    //window.alert(this.orgInfo.name);
    this.orgAsset = this.orgForm.asset
    //this.finances = this.orgForm.finance
    this.showBudget('1')
    // var tmp = this.toNonExponential('1e3')
    // console.log(tmp)
  },
  // computed: {
  //   ...mapGetters(['coinbase', 'orgForm'])
  // },
  methods:{

    showBudget(budget){
      var amount = '1e' + this.decimal
      var num = new Number(amount)
      var res = this.toNonExponential(num)

      return budget / res
    },

    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    },
  },
  computed: {
    assetsCount() {
      return this.orgForm.finance.length
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.assets {
  .asset-list {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: 24px;
      }

      svg {
        width: 64px;
        height: 64px;
        padding: 8px;
        border-radius: 50%;
        border: 1px solid rgba(55, 64, 89, 0.1);
      }

      .asset-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 20px;

        .asset-header {
          margin: 0 0 8px 0;

          .asset-balance {
            font-size: 20px;
            line-height: 24px;
            font-weight: bold;
            color: $titleColor;
          }
        }

        .asset-address {
          color: $secondaryColor;
          font-size: 18px;
          line-height: 21px;
        }
      } // end: .asset-content

      .assign-token {
        margin-left: auto;
      }
    }
  }

  .message {
    display: block;
    margin: 125px auto;
    text-align: center;
    font-size: 20px;
    line-height: 29px;
    font-weight: 400;

    .link {
      color: $menuActiveText;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
