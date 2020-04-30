<template>
  <div>
    <!-- LOADING VIEW -->
    <!-- <div v-if='status === 0'>
      <div class="container">
        <content-loader :width=500 :height=900>
          <rect x="16" y="10" rx="8" ry="8" width="80" height="20" />
          <rect x="112" y="10" rx="8" ry="8" width="100" height="20" />
          <rect x="228" y="10" rx="8" ry="8" width="60" height="20" />
          <rect x="304" y="10" rx="8" ry="8" width="120" height="20" />
          <rect x="16" y="80" rx="8" ry="8" width="100" height="40" />
          <template v-for="i in 5">
            <rect x="16" :y="150+(150*(i-1))" rx="8" ry="8" width="100" height="100" :key="i*8+0" />
            <rect x="132" :y="150+(150*(i-1))" rx="8" ry="8" width="220" height="20" :key="i*8+1" />
            <rect x="132" :y="180+(150*(i-1))" rx="8" ry="8" width="140" height="20" :key="i*8+2" />
            <rect x="132" :y="230+(150*(i-1))" rx="8" ry="8" width="80" height="20" :key="i*8+3" />
            <rect x="340" :y="230+(150*(i-1))" rx="8" ry="8" width="80" height="20" :key="i*8+4" />
          </template>
        </content-loader>
      </div>
    </div> -->

    <!-- CONTENT VIEW -->
    <div>
      <!-- CONTENT -->
      <div class="container menu">
        <!-- <button class="submit-order" v-on:click="goBack()">กลับ</button> -->
        <h1 class="text-align-left title">Order Summary</h1>
        <table>
          <tr
            v-for="(item, index) in data.summary"
            :key="item.id"
            :class="{ disabled: item.enable === '0' }"
          >
            <!-- <th v-show="is_visible_image" class="menu-img">
                <template v-if="item.image_url.trim() !== ''"><img class='img-item' :src='item.image_url'/></template>
                <template v-else><img class='img-item' :src='"@/assets/images/placeholder_image.png"'/></template>
            </th>-->
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
                    v-on:click="decrease(index)"
                    :disabled="item.amount == 0"
                  >
                    <i class="fas fa-minus fa-lg"></i>
                  </button>
                  <div class="number">{{ item.amount }}</div>
                  <button
                    class="btn-circle"
                    type="button"
                    v-on:click="increase(index)"
                  >
                    <i class="fas fa-plus fa-lg"></i>
                  </button>
                </div>
                <div
                  class="stepper menu-buyer-quantity"
                  style="padding-left: 30%"
                >
                  <button
                    class="btn-circle"
                    type="button"
                    v-on:click="deleteMenu(index)"
                  >
                    <i class="fas fa-trash fa-lg"></i>
                  </button>
                </div>
              </section>
            </th>
          </tr>
        </table>

        <span>
          <p style="text-align:left">
            หมายเหตุ
            <br />
          </p>
          <p style="text-align:left">
            คุณสามารถใส่ข้อมูลเพิ่มเติมได้ที่นี่ เช่นอาหารที่แพ้
            เครื่องปรุงที่ต้องหลีกเลี่ยง เป็นต้น
          </p>
        </span>
        <textarea
          class="textarea"
          v-model="message"
          placeholder="สิ่งที่คุณต้องการเพิ่มเติม"
          rows="5"
        ></textarea>
        <div style="text-align: left;">
          <button class="btn" type="button" v-on:click="goBack()">
            <i class="fas fa-chevron-left fa-lg"></i> back
          </button>
        </div>
        <div class="footer-space"></div>
      </div>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="container">
          <div class="summary">
            <div class="summary-total">฿{{ total.toFixed(2) }}</div>
            <button
              class="submit-order"
              v-on:click="send_message()"
              :disabled="total === 0"
            >
              Submit Order
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import { SendMessages } from '../assets/js/sendMessage'
export default {
  data() {
    return {
      data: "",
      total: 0,
      message: ""
    };
  },
  created() {
    this.data = this.$route.params.id;
    console.log(this.data);
    for (let x = 0; x < this.data.summary.length; x++) {
      this.total += this.data.summary[x].price * this.data.summary[x].amount;
    }
  },
  methods: {
    whiteSpace: function(str) {
      return str
        .toLowerCase()
        .trim()
        .split(" ")
        .join("-");
    },
    increase: function(index) {
      this.total = 0;
      this.data.summary[index].amount += 1;
      for (let x = 0; x < this.data.summary.length; x++) {
        this.total += this.data.summary[x].price * this.data.summary[x].amount;
      }
    },
    decrease: function(index) {
      if (this.data.summary[index].amount > 0) {
        this.total = 0;
        this.data.summary[index].amount -= 1;
        for (let x = 0; x < this.data.summary.length; x++) {
          this.total +=
            this.data.summary[x].price * this.data.summary[x].amount;
        }
      }
    },
    deleteMenu: function(index) {
      this.data.summary.splice(index, 1);
      this.total = 0;
      for (let x = 0; x < this.data.summary.length; x++) {
        this.total += this.data.summary[x].price * this.data.summary[x].amount;
      }
    },
    showMsg: function() {
      console.log(this.message);
    },
    goBack: function() {
      history.go(-1);
    },
    send_message: function() {
      // Variable
      var shipping = 0;
      this.delivery_fee.forEach(level => {
        if (level.condition.trim() === ">") {
          if (shipping === 0) {
            shipping = Number.MAX_VALUE;
          }
          if (this.total >= level.total) {
            if (level.fee < shipping) {
              shipping = level.fee;
            }
          }
        } else {
          if (this.total < level.total) {
            if (level.fee > shipping) {
              shipping = level.fee;
            }
          }
        }
      });
      // sendMessages()
    }
  }
};
</script>

<style scoped>
.btn {
  background: white;
  border: none;
}
textarea {
  resize: none;
  width: 100%;
}
</style>

<style src="../assets/css/home.css" scoped></style>
