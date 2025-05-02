# 🎸 Tab3U-NG - https://tab3u.com 

You may have browsed [Tab4U](https://www.tab4u.com) chords website, tried clicking that button

![EasyVersion](assets/easy_version.png)

and got

![PremiumPaywall](assets/premium_paywall.png)

FUCK

So I deployed Tab3U - Tab(Free)U

Proxy server that allows free transposition for Tab4U

**Go https://tab3u.com**

## How?

Nginx server that does `proxy_pass` to Tab4U website

Injecting a javascript file by adding `<script>` tag to responses for `/tabs/songs/...` pages - check out [nginx site configuration](nginx_site.conf)

The javascript file overrides all necessary elements with my own functions - check out [inject.js](tab3u.com/inject.js)

EASY

![](https://skillicons.dev/icons?i=nginx,javascript,linux)

## Demo

![Demo](assets/demo.gif)