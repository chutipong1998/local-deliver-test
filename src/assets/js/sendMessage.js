/* eslint-disable */
function sendMessages(liff, counter, total, catagories, shopName, shipping) {
  const LINE_LIFF_ID = "1654119168-oE6Wj9bn";
  var nameCustomer = "";

  // Init Line LIFF
  liff
    .init({
      liffId: LINE_LIFF_ID
    })
    .then(() => {
      var items = [];
      if (liff.isLoggedIn()) {
        liff
          .getProfile()
          .then(profile => {
            nameCustomer = profile.displayName;
            for (let i = 0; i < counter.length; i++) {
              for (let j = 0; j < counter[i].length; j++) {
                if (counter[i][j] > 0) {
                  items.push({
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "text",
                        text: counter[i][j].toString() + "x ",
                        flex: 0,
                        margin: "sm",
                        weight: "regular"
                      },
                      {
                        type: "text",
                        text: catagories[i].menus[j].name,
                        margin: "lg",
                        weight: "bold",
                        wrap: true
                      },
                      {
                        type: "text",
                        text: (
                          catagories[i].menus[j].price * counter[i][j]
                        ).toString(),
                        size: "sm",
                        align: "end",
                        color: "#AAAAAA"
                      }
                    ]
                  });
                }
              }
            }
            const self = this;
            liff
              .sendMessages([
                {
                  type: "flex",
                  altText: "New order form " + nameCustomer,
                  contents: {
                    type: "bubble",
                    header: {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Your Order",
                          size: "lg",
                          gravity: "center",
                          weight: "bold",
                          color: "#3DC85B"
                        },
                        {
                          type: "text",
                          text: shopName,
                          margin: "md",
                          size: "xl",
                          weight: "bold"
                        },
                        {
                          type: "text",
                          text: nameCustomer,
                          margin: "md",
                          size: "md",
                          align: "start",
                          gravity: "center",
                          weight: "regular",
                          color: "#727070"
                        }
                      ]
                    },
                    body: {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "separator",
                          margin: "lg"
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          spacing: "sm",
                          margin: "xl",
                          contents: items
                        },
                        {
                          type: "separator",
                          margin: "lg",
                          color: "#FFFFFF"
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          spacing: "sm",
                          contents: [
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "ค่าอาหาร",
                                  margin: "lg",
                                  weight: "regular",
                                  wrap: true
                                },
                                {
                                  type: "text",
                                  text: total.toString(),
                                  size: "sm",
                                  align: "end",
                                  weight: "bold",
                                  color: "#AAAAAA"
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          spacing: "sm",
                          contents: [
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "ค่าจัดส่ง",
                                  margin: "lg",
                                  weight: "regular",
                                  wrap: true
                                },
                                {
                                  type: "text",
                                  text: shipping.toString(),
                                  size: "sm",
                                  align: "end",
                                  weight: "bold",
                                  color: "#AAAAAA"
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: "separator",
                          margin: "lg"
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          spacing: "lg",
                          margin: "lg",
                          contents: [
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "รวม",
                                  margin: "xl",
                                  size: "lg",
                                  align: "start",
                                  gravity: "center",
                                  weight: "bold",
                                  wrap: true
                                },
                                {
                                  type: "text",
                                  text: (shipping + total).toString(),
                                  size: "sm",
                                  align: "end",
                                  weight: "bold",
                                  color: "#AAAAAA"
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    footer: {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Powered by Tiny POS",
                          size: "xxs",
                          align: "center",
                          gravity: "center",
                          weight: "regular",
                          color: "#A5A2A2"
                        }
                      ]
                    }
                  }
                }
              ])
              .then(function() {
                self.liff.closeWindow();
              })
              .catch(function() {
                self.liff.closeWindow();
              });
          })
          .catch(() => {
            self.liff.closeWindow();
          });
      } else {
        liff.login();
      }
    })
    .catch(err => {
      // Error happens during initialization
      console.log(err.code, err.message);
      liff.closeWindow();
    });
}
export { sendMessages };
