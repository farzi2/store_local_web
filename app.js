document.addEventListener('alpine:init', () => {
  Alpine.data('products', () => ({
    items: [
        { id: 1, name: 'Tas Anyaman', img: 'A.jpg', price: 55000 },
        { id: 2, name: 'Kotak Tisu', img: 'B.jpg', price: 15000 },
        { id: 3, name: 'Rak Alat Makan', img: 'C.jpg', price: 65000 },
        { id: 4, name: 'Cangkir Batok Kelapa', img: 'D.jpg', price: 25000 },
        { id: 5, name: 'Rak Alat Tulis', img: 'E.jpg', price: 35000 },
    ],
   
  }));

Alpine.store('cart', {
  items: [],
  total: 0,
  quantity: 0,
  add(newItem) {
    // cek barang yang sama
    const cartItem = this.items.find((item) => item.id === newItem.id);

  // jika belum ada /cart masih kosong
  if(!cartItem){
    this.items.push({...newItem, quantity: 1, total: newItem.price});
    this.quantity++;
    this.total += newItem.price;
  } else {
    // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
    this.items = this.items.map((item) => {
      // jika barang berbeda
      if (item.id !== newItem.id) {
        return item;
      } else {
        // jika barang sudah ada,tambah quantity dan subtotalnya
        item.quantity++;
        item.total = item.price * item.quantity;
         this.quantity++;
         this.total += item.price;
         return item;

      }
    });
Alpine.detail('detail-box', {
  items: [products],
})
  }

  },


  remove(id) {
    // ambil item yang mau di remove berdasarkan id nya
    const cartItem = this.items.find((item) => item.id === id);

    // jika item lebih satu
    if(cartItem.quantity > 1 ){
      // telusuri satu2
      this.items = this.items.map((item) => {
        // jika bukan barang yang di klik
        if(item.id !== id) {
          return item;
        } else {
          item.quantity--;
          item.total = item.price * item.quantity;
          this.quantity--;
          this.total -= item.price;
          return item;
        }
      })
    } else if (cartItem.quantity === 1) {
      // jika barang nya sisa satu
      this.items = this.items.filter((item) => item.id !== id);
      this.quantity--;
      this.total -= cartItem.price;
    }
  },

});

});

// form validation
 const checkoutButton = document.querySelector('.checkout-button');
 checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function(){
  for(let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove('disabled');
      checkoutButton.classList.add('disabled');
    } else {
      return false;
    }
  }
 checkoutButton.disabled = false;
 checkoutButton.classList.remove('disabled');

});



checkoutButton.addEventListener('click', function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open('http://wa.me/6289507911352?text=' + encodeURIComponent(message));
});


// format pesan whatsaap
const formatMessage = (obj) => {
  return `Data Customer
   Nama: ${obj.name}
   Email: ${obj.email}
   No HP: ${obj.phone}
Data Pesanan
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
 TOTAL: ${rupiah(obj.total)} 
 Terima kasih.`;
};






// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);

};