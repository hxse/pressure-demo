# pressure-demo
* draw picture with wacom
# todo
* 有个bug,就是打开控制台,性能很快,关上控制台,性能很慢,明显卡顿,原因不知,可能是事件的刷新频率不够
* todo,用这个重构(现在找到慢的原因了,就不必要用这个了)
  * https://www.perfectfreehand.com
  * https://github.com/steveruizok/perfect-freehand
  * https://github.com/steveruizok/rko
* 找到慢的原因了,https://codesandbox.io/s/goofy-ioana-5t3427?file=/index.html
  * 首先用getCoalescedEvents把事件拆分
  * 注意ctx.fill()要放到循环括号的内部, 不然也会慢
* todo
  * 之前为了解决性能问题,写得太繁琐了,有时间重构一下
