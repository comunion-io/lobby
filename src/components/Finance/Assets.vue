<template>
  <div class="assets">
    <el-card class="box-card full">
      <ul v-if="assetsCount" class="asset-list">
        <li v-for="asset in assets" v-bind:key="asset.id">
          <svg-icon :icon-class="`logo-${asset.symbol.toLowerCase()}`" />
          <div class="asset-content">
            <div class="asset-header">
              <span class="asset-balance">{{ asset.balance }} {{ asset.symbol }}</span>
              <tag v-if="asset.isHost" text="Host" />
              <tag v-for="(t,index) in asset.tags" :text="t" :key="index" />
            </div>
            <div class="asset-address">{{ asset.address }}</div>
          </div>

          <router-link
            v-if="asset.balance > 0"
            class="assign-token"
            :to="{ name: 'assign-token', params: asset.id }"
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
        <router-link :to="{ name: 'token-manager' }" class="link">publishing token.</router-link>
      </h4>
    </el-card>
  </div>
</template>

<script>
import { Tag, Button as CuButton } from '@/components/Common'
export default {
  components: {
    Tag,
    CuButton
  },
  data() {
    return {
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
  computed: {
    assetsCount() {
      return this.assets.length
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.assets {
  .asset-list {
    list-style-type: none;
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
