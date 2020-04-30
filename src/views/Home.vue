<template>
  <div>
    <!-- LOADING VIEW -->
    <div v-if="status === 0">
      <div class="container">
        <content-loader :width="500" :height="900">
          <rect x="16" y="10" rx="8" ry="8" width="80" height="20" />
          <rect x="112" y="10" rx="8" ry="8" width="100" height="20" />
          <rect x="228" y="10" rx="8" ry="8" width="60" height="20" />
          <rect x="304" y="10" rx="8" ry="8" width="120" height="20" />
          <rect x="16" y="80" rx="8" ry="8" width="100" height="40" />
          <template v-for="i in 5">
            <rect
              x="16"
              :y="150 + 150 * (i - 1)"
              rx="8"
              ry="8"
              width="100"
              height="100"
              :key="i * 8 + 0"
            />
            <rect
              x="132"
              :y="150 + 150 * (i - 1)"
              rx="8"
              ry="8"
              width="220"
              height="20"
              :key="i * 8 + 1"
            />
            <rect
              x="132"
              :y="180 + 150 * (i - 1)"
              rx="8"
              ry="8"
              width="140"
              height="20"
              :key="i * 8 + 2"
            />
            <rect
              x="132"
              :y="230 + 150 * (i - 1)"
              rx="8"
              ry="8"
              width="80"
              height="20"
              :key="i * 8 + 3"
            />
            <rect
              x="340"
              :y="230 + 150 * (i - 1)"
              rx="8"
              ry="8"
              width="80"
              height="20"
              :key="i * 8 + 4"
            />
          </template>
        </content-loader>
      </div>
    </div>

    <!-- CONTENT VIEW -->
    <div v-else-if="status === 200">
      <!-- HEADER -->
      <header v-if="categories.length > 1" class="header">
        <div class="container">
          <!--
          <fixed-header :threshold="0">
          -->
          <div class="navbar scroll-horizontal">
            <scrollactive
              active-class="active"
              class="nav-menu"
              :modifyUrl="false"
            >
              <template v-for="(category, i) in categories">
                <a
                  :href="'#' + whiteSpace(category.name)"
                  :key="i"
                  class="scrollactive-item"
                  >{{ category.name }}</a
                >
              </template>
            </scrollactive>
          </div>
          <!--
          </fixed-header>
          -->
        </div>
      </header>

      <!-- CONTENT -->
      <div class="container menu">
        <table>
          <section
            v-for="(category, x) in categories"
            :key="x"
            :id="whiteSpace(category.name)"
          >
            <template v-if="x == 0">
              <h1
                class="text-align-left title"
                :class="{ active: categories.length > 1 }"
              >
                All Menu
              </h1>
            </template>
            <template v-else>
              <h2 class="text-align-left category">{{ category.name }}</h2>
            </template>
            <tr
              v-for="(item, y) in category.menus"
              :key="item.id"
              :class="{ disabled: item.enable === '0' }"
            >
              <th v-show="is_visible_image" class="menu-img">
                <template v-if="item.image_url.trim() !== ''">
                  <img class="img-item" :src="item.image_url" />
                </template>
                <template v-else>
                  <img
                    class="img-item"
                    :src="'@/assets/images/placeholder_image.png'"
                  />
                </template>
              </th>
              <th class="menu-detail" valign="top" width="100%">
                <h2 class="menu-name">{{ item.name }}</h2>
                <section class="menu-buyer">
                  <div class="menu-buyer-price">
                    <h3>฿{{ item.price }}</h3>
                  </div>
                  <div class="stepper menu-buyer-quantity">
                    <button
                      class="btn-circle"
                      type="button"
                      v-on:click="decrease(x, y)"
                      :disabled="counter[x][y] == 0 || item.enable === '0'"
                    >
                      <i class="fas fa-minus fa-lg"></i>
                    </button>
                    <div class="number">{{ counter[x][y] }}</div>
                    <button
                      class="btn-circle"
                      type="button"
                      v-on:click="increase(x, y)"
                      :disabled="item.enable === '0'"
                    >
                      <i class="fas fa-plus fa-lg"></i>
                    </button>
                  </div>
                </section>
              </th>
            </tr>
          </section>
        </table>
        <div class="footer-space"></div>
      </div>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="container">
          <div class="summary">
            <div class="summary-total">฿{{ total.toFixed(2) }}</div>
            <router-link :to="{ name: 'summary', params: { id: summary() } }">
              <button class="submit-order" :disabled="total === 0">
                Checkout
              </button>
            </router-link>
            <!-- <button class='submit-order'  v-on:click='send_message()' :disabled='total === 0'>Submit Order</button> -->
          </div>
        </div>
      </footer>
    </div>

    <!-- NOT FOUND VIEW -->
    <div v-else>
      <page-not-found></page-not-found>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
const API_URL = "https://asia-east2-testlocall.cloudfunctions.net/menu/";

import { sendMessages } from "../assets/js/sendMessage.js";
// const API_URL = "https://asia-east2-order-with-local.cloudfunctions.net/menu/"
export default {
  data() {
    return {
      counter: [],
      total: 0,
      status: 0,
      shop_name: "",
      is_visible_image: true,
      categories: "",
      payment: "",
      delivery_fee: "",
      data: ["dhdth", "dthdht", "dthdth"]
    };
  },
  created() {
    this.$http.get(API_URL + this.$route.query.shop).then(
      response => {
        this.status = response.data.status.code;
        if (response.data.status.code === 200) {
          this.shop_name = response.data.data.shop.name;
          document.title = this.shop_name;
          this.categories = response.data.data.categories;
          this.payment = response.data.data.payment
            ? response.data.data.payment
            : [];
          this.delivery_fee = response.data.data.delivery_fee
            ? response.data.data.delivery_fee
            : [];
          this.categories.forEach(category => {
            var arry = [];
            category.menus.forEach(menu => {
              arry.push(0);
            });
          });
          this.payment = response.data.data.payment
            ? response.data.data.payment
            : [];
          this.delivery_fee = response.data.data.delivery_fee
            ? response.data.data.delivery_fee
            : [];
          this.categories.forEach(category => {
            var l = [];
            category.menus.forEach(menu => {
              l.push(0);
            });
            this.counter.push(l);
            // this.data = [this.counter]
          });
        } else {
          this.shop_name = "404 - The Shop can't be found";
          document.title = this.shop_name;
        }
      },
      () => {
        this.status = 500;
        this.shop_name = "500 - Internal Server Error";
        document.title = this.shop_name;
      }
    );
  },
  methods: {
    whiteSpace: function(str) {
      return str
        .toLowerCase()
        .trim()
        .split(" ")
        .join("-");
    },
    increase: function(x, y) {
      if (this.categories[x].menus[y].enable !== "0") {
        this.total = 0;
        this.counter[x][y] += 1;
        for (let x = 0; x < this.counter.length; x++) {
          for (let y = 0; y < this.counter[x].length; y++) {
            this.total +=
              this.categories[x].menus[y].price * this.counter[x][y];
          }
        }
      }
    },
    summary: function() {
      var summaryItems = [];
      for (let i = 0; i < this.counter.length; i++) {
        for (let j = 0; j < this.counter[i].length; j++) {
          if (this.counter[i][j] > 0) {
            summaryItems.push({
              amount: this.counter[i][j],
              name: this.categories[i].menus[j].name,
              price: this.categories[i].menus[j].price
            });
          }
        }
      }
      return {
        summary: summaryItems,
        payment: this.payment,
        delivery_fee: this.delivery_fee
      };
    },
    decrease: function(x, y) {
      if (this.counter[x][y] > 0) {
        this.total = 0;
        this.counter[x][y] -= 1;
        for (let x = 0; x < this.counter.length; x++) {
          for (let y = 0; y < this.counter[x].length; y++) {
            this.total +=
              this.categories[x].menus[y].price * this.counter[x][y];
          }
        }
      }
    },
    send_message: function() {
      // Variable
      var shipping = this.delivery_fee === [] ? 0 : "";
      this.delivery_fee.forEach(level => {
        if (level.condition.trim() === ">") {
          if (shipping === "") {
            shipping = Number.MAX_VALUE;
          }
          if (this.total >= level.total) {
            if (level.fee < shipping) {
              shipping = Number(level.fee.trim());
            }
          }
        } else {
          if (this.total < level.total) {
            if (shipping === "") {
              shipping = 0;
            }
            if (level.fee > shipping) {
              shipping = Number(level.fee.trim());
            }
          }
        }
      });
      shipping = shipping === "" ? 0 : shipping;
      sendMessages(
        this.liff,
        this.counter,
        this.total,
        this.categories,
        this.shop_name,
        shipping
      );
    }
  }
};
</script>

<style src="../assets/css/home.css" scoped></style>
