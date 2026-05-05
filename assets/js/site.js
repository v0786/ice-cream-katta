const SITE = {
  name: "Ice Cream Katta",
  phone: "+91-90000-00000",
  currency: "INR",
  cartStorageKey: "ick_cart_v1"
};

const PRODUCTS = [
  {
    id: "menu-1",
    name: "Chocolate Sundae",
    category: "Sundaes",
    price: 149,
    description: "Rich chocolate, crunchy bits, and a silky finish.",
    image: "./assets/images/menu-1.jpg"
  },
  {
    id: "menu-2",
    name: "Strawberry Delight",
    category: "Scoops",
    price: 99,
    description: "Sweet strawberry notes with a creamy scoop.",
    image: "./assets/images/menu-2.jpg"
  },
  {
    id: "menu-3",
    name: "Classic Vanilla",
    category: "Scoops",
    price: 89,
    description: "Old-school vanilla made extra smooth and fragrant.",
    image: "./assets/images/menu-3.jpg"
  },
  {
    id: "tutti-frutti",
    name: "Tutti Frutti Fun",
    category: "Scoops",
    price: 99,
    description: "Colorful candied fruit in a creamy base.",
    image: "./assets/images/tutti.jpg"
  },
  {
    id: "mango-kulfi",
    name: "Mango Kulfi",
    category: "Kulfi",
    price: 119,
    description: "Dense, traditional kulfi with mango goodness.",
    image: "./assets/images/kulfi.jpg"
  },
  {
    id: "rose-falooda",
    name: "Rose Falooda",
    category: "Falooda",
    price: 169,
    description: "Rose syrup, noodles, basil seeds, and ice cream.",
    image: "./assets/images/falooda.jpg"
  },
  {
    id: "oreo-shake",
    name: "Oreo Thick Shake",
    category: "Shakes",
    price: 179,
    description: "Cookie crumble blended into a thick, cold shake.",
    image: "./assets/images/oreo-shake.jpg"
  },
  {
    id: "kitkat-shake",
    name: "KitKat Shake",
    category: "Shakes",
    price: 189,
    description: "Chocolatey crunch in every sip.",
    image: "./assets/images/kitkat-shake.jpg"
  },
  {
    id: "butterscotch",
    name: "Butterscotch Crunch",
    category: "Scoops",
    price: 109,
    description: "Golden caramel notes with crunchy praline.",
    image: "./assets/images/butterscotch.jpg"
  },
  {
    id: "brownie-sundae",
    name: "Brownie Fudge Sundae",
    category: "Sundaes",
    price: 199,
    description: "Warm brownie + cold scoop + fudgy drizzle.",
    image: "./assets/images/brownie-sundae.jpg"
  },
  {
    id: "family-pack",
    name: "Family Pack (500ml)",
    category: "Family Packs",
    price: 299,
    description: "Pick a flavor and take happiness home.",
    image: "./assets/images/family-pack.jpg"
  },
  {
    id: "seasonal-special",
    name: "Seasonal Special",
    category: "Specials",
    price: 179,
    description: "Ask in-store or check our socials for today’s special.",
    image: "./assets/images/special.jpg"
  }
];

const REVIEWS = [
  {
    name: "Aarav",
    stars: 5,
    text: "Super creamy scoops and quick service. The sundaes are a must-try!"
  },
  {
    name: "Meera",
    stars: 5,
    text: "Loved the falooda. Clean place and friendly staff."
  },
  {
    name: "Kunal",
    stars: 4,
    text: "Great flavors and good portions. Perfect for late-night cravings."
  }
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: SITE.currency,
    maximumFractionDigits: 0
  }).format(value);
}

function getCart() {
  try {
    const raw = localStorage.getItem(SITE.cartStorageKey);
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { items: {} };
    if (!parsed.items || typeof parsed.items !== "object") return { items: {} };
    return parsed;
  } catch {
    return { items: {} };
  }
}

function setCart(cart) {
  localStorage.setItem(SITE.cartStorageKey, JSON.stringify(cart));
}

function cartCount(cart = getCart()) {
  return Object.values(cart.items).reduce((sum, qty) => sum + Number(qty || 0), 0);
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const current = Number(cart.items[productId] || 0);
  const next = Math.min(99, Math.max(0, current + Number(qty)));
  if (next <= 0) {
    delete cart.items[productId];
  } else {
    cart.items[productId] = next;
  }
  setCart(cart);
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
  return cart;
}

function setCartQty(productId, qty) {
  const cart = getCart();
  const next = Math.min(99, Math.max(0, Number(qty)));
  if (next <= 0) delete cart.items[productId];
  else cart.items[productId] = next;
  setCart(cart);
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
  return cart;
}

function clearCart() {
  const cart = { items: {} };
  setCart(cart);
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
  return cart;
}

function cartSubtotal(cart = getCart()) {
  const items = Object.entries(cart.items);
  return items.reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return sum;
    return sum + product.price * Number(qty || 0);
  }, 0);
}

function setYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = year;
  });
}

function setupNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (nav.contains(target) || toggle.contains(target)) return;
    close();
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", close);
  });
}

function renderCartBadge(cart = getCart()) {
  const badgeEls = document.querySelectorAll("[data-cart-badge]");
  const count = cartCount(cart);
  badgeEls.forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? "inline-grid" : "none";
  });
}

function productCard(product) {
  const tag =
    product.category === "Specials"
      ? `<span class="tag">Limited</span>`
      : `<span class="tag">${escapeHtml(product.category)}</span>`;

  return `
    <article class="card">
      <div class="card-media">
        <img loading="lazy" src="${product.image}" alt="${escapeHtml(product.name)}" />
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(product.name)}</h3>
        <p class="card-desc">${escapeHtml(product.description)}</p>
        <div class="card-row">
          <span class="price">${formatPrice(product.price)}</span>
          ${tag}
        </div>
        <div class="card-row">
          <button class="btn btn-primary" type="button" data-add-to-cart="${product.id}">
            Add to Cart
          </button>
          <a class="btn btn-ghost" href="./order.html">View Cart</a>
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  const featuredEl = document.querySelector("[data-featured-flavors]");
  if (featuredEl) {
    const featured = PRODUCTS.slice(0, 3);
    featuredEl.innerHTML = featured
      .map(
        (p) => `
          <div class="featured-item">
            <img class="featured-img" loading="lazy" src="${p.image}" alt="${escapeHtml(p.name)}" />
            <div>
              <p class="featured-title">${escapeHtml(p.name)}</p>
              <p class="featured-meta">${formatPrice(p.price)} · ${escapeHtml(p.category)}</p>
            </div>
          </div>
        `
      )
      .join("");
  }

  const bestEl = document.querySelector("[data-bestsellers]");
  if (bestEl) {
    const best = [
      PRODUCTS.find((p) => p.id === "brownie-sundae"),
      PRODUCTS.find((p) => p.id === "oreo-shake"),
      PRODUCTS.find((p) => p.id === "butterscotch")
    ].filter(Boolean);
    bestEl.innerHTML = best.map(productCard).join("");
  }

  const reviewsEl = document.querySelector("[data-reviews]");
  if (reviewsEl) {
    reviewsEl.innerHTML = REVIEWS.map((r) => reviewCard(r)).join("");
  }
}

function reviewCard(r) {
  const stars = "★".repeat(Math.max(1, Math.min(5, r.stars)));
  return `
    <div class="review">
      <div class="review-top">
        <span class="review-name">${escapeHtml(r.name)}</span>
        <span class="review-stars">${stars}</span>
      </div>
      <p class="review-text">${escapeHtml(r.text)}</p>
    </div>
  `;
}

function renderMenuPage() {
  const listEl = document.querySelector("[data-menu-grid]");
  if (!listEl) return;

  const chipsEl = document.querySelector("[data-menu-chips]");
  const searchEl = document.querySelector("[data-menu-search]");
  const countEl = document.querySelector("[data-menu-count]");

  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  const allCats = ["All", ...categories];

  let state = { category: "All", query: "" };

  const syncCount = (items) => {
    if (!countEl) return;
    countEl.textContent = `${items.length} items`;
  };

  const apply = () => {
    const q = state.query.trim().toLowerCase();
    const items = PRODUCTS.filter((p) => {
      const byCat = state.category === "All" || p.category === state.category;
      const byQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return byCat && byQuery;
    });
    listEl.innerHTML = items.map(productCard).join("");
    syncCount(items);
  };

  if (chipsEl) {
    chipsEl.innerHTML = allCats
      .map(
        (c) =>
          `<button class="chip" type="button" aria-pressed="${c === "All"}" data-filter-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`
      )
      .join("");

    chipsEl.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const cat = t.getAttribute("data-filter-cat");
      if (!cat) return;
      state.category = cat;
      chipsEl.querySelectorAll("[data-filter-cat]").forEach((btn) => {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-filter-cat") === cat ? "true" : "false");
      });
      apply();
    });
  }

  if (searchEl) {
    searchEl.addEventListener("input", () => {
      state.query = String(searchEl.value || "");
      apply();
    });
  }

  apply();
}

function renderOrderPage() {
  const cartEl = document.querySelector("[data-cart-list]");
  const totalsEl = document.querySelector("[data-cart-totals]");
  if (!cartEl || !totalsEl) return;

  const emptyEl = document.querySelector("[data-cart-empty]");
  const checkoutForm = document.querySelector("[data-checkout-form]");
  const deliveryAddressField = document.querySelector("[data-delivery-address]");
  const deliveryWrap = document.querySelector("[data-delivery-wrap]");
  const confirmEl = document.querySelector("[data-order-confirm]");

  const render = (cart = getCart()) => {
    const entries = Object.entries(cart.items);
    if (entries.length === 0) {
      cartEl.innerHTML = "";
      totalsEl.innerHTML = "";
      if (emptyEl) emptyEl.style.display = "block";
      if (checkoutForm) checkoutForm.style.display = "none";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (checkoutForm) checkoutForm.style.display = "block";

    const items = entries
      .map(([id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === id);
        if (!p) return null;
        const line = p.price * Number(qty || 0);
        return {
          id,
          name: p.name,
          category: p.category,
          description: p.description,
          image: p.image,
          price: p.price,
          qty: Number(qty || 0),
          line
        };
      })
      .filter(Boolean);

    cartEl.innerHTML = items
      .map(
        (it) => `
          <div class="cart-item">
            <img class="cart-img" loading="lazy" src="${it.image}" alt="${escapeHtml(it.name)}" />
            <div>
              <p class="cart-title">${escapeHtml(it.name)}</p>
              <p class="cart-desc">${escapeHtml(it.category)} · ${formatPrice(it.price)} each</p>
              <div class="cart-row">
                <div class="qty" aria-label="Quantity controls">
                  <button type="button" aria-label="Decrease quantity" data-qty-minus="${it.id}">−</button>
                  <span aria-label="Quantity">${it.qty}</span>
                  <button type="button" aria-label="Increase quantity" data-qty-plus="${it.id}">+</button>
                </div>
                <div class="price">${formatPrice(it.line)}</div>
                <button class="btn btn-danger" type="button" data-remove="${it.id}">Remove</button>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    const subtotal = cartSubtotal(cart);
    const packingFee = subtotal > 0 ? 10 : 0;
    const total = subtotal + packingFee;

    totalsEl.innerHTML = `
      <div class="totals">
        <div class="totals-row"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div>
        <div class="totals-row"><span>Packing</span><strong>${formatPrice(packingFee)}</strong></div>
        <div class="totals-row"><span>Total</span><strong>${formatPrice(total)}</strong></div>
      </div>
      <p class="help">Payments: Pay at pickup/delivery. For custom cakes or bulk orders, contact us first.</p>
      <button class="btn btn-ghost" type="button" data-clear-cart>Clear Cart</button>
    `;
  };

  cartEl.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const minusId = t.getAttribute("data-qty-minus");
    if (minusId) return addToCart(minusId, -1);

    const plusId = t.getAttribute("data-qty-plus");
    if (plusId) return addToCart(plusId, 1);

    const removeId = t.getAttribute("data-remove");
    if (removeId) return setCartQty(removeId, 0);
  });

  totalsEl.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.hasAttribute("data-clear-cart")) clearCart();
  });

  const syncDelivery = () => {
    const method = String(
      document.querySelector('input[name="fulfillment"]:checked')?.value || "pickup"
    );
    const isDelivery = method === "delivery";
    if (deliveryWrap) deliveryWrap.style.display = isDelivery ? "block" : "none";
    if (deliveryAddressField) deliveryAddressField.toggleAttribute("required", isDelivery);
  };

  document.querySelectorAll('input[name="fulfillment"]').forEach((radio) => {
    radio.addEventListener("change", syncDelivery);
  });
  syncDelivery();

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!(form instanceof HTMLFormElement)) return;

      form.querySelectorAll("[data-error-for]").forEach((el) => {
        el.textContent = "";
      });

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const fulfillment = String(data.get("fulfillment") || "pickup");
      const address = String(data.get("address") || "").trim();

      let ok = true;
      if (name.length < 2) {
        setError("name", "Please enter your name.");
        ok = false;
      }
      if (!/^[0-9+\-\s]{8,16}$/.test(phone)) {
        setError("phone", "Please enter a valid phone number.");
        ok = false;
      }
      if (fulfillment === "delivery" && address.length < 8) {
        setError("address", "Please enter your delivery address.");
        ok = false;
      }
      if (cartCount(getCart()) === 0) {
        ok = false;
      }
      if (!ok) return;

      clearCart();
      if (confirmEl) {
        confirmEl.textContent = `Thanks, ${name}! Your order is confirmed. We'll contact you at ${phone} for details.`;
        confirmEl.style.display = "block";
        confirmEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      form.reset();
      syncDelivery();
    });
  }

  function setError(fieldName, message) {
    const el = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (el) el.textContent = message;
  }

  render();
  document.addEventListener("cart:updated", (e) => {
    render(e.detail);
  });
}

function renderContactPage() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const notice = document.querySelector("[data-contact-success]");
  const setError = (fieldName, message) => {
    const el = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (el) el.textContent = message;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!(form instanceof HTMLFormElement)) return;

    form.querySelectorAll("[data-error-for]").forEach((el) => {
      el.textContent = "";
    });
    if (notice) notice.style.display = "none";

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    let ok = true;
    if (name.length < 2) {
      setError("name", "Please enter your name.");
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Please enter a valid email.");
      ok = false;
    }
    if (phone.length > 0 && !/^[0-9+\-\s]{8,16}$/.test(phone)) {
      setError("phone", "Please enter a valid phone number.");
      ok = false;
    }
    if (message.length < 10) {
      setError("message", "Please tell us a bit more (10+ characters).");
      ok = false;
    }

    if (!ok) return;
    form.reset();
    if (notice) notice.style.display = "block";
  });
}

function setupGlobalAddToCart() {
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const id = t.getAttribute("data-add-to-cart");
    if (!id) return;
    addToCart(id, 1);
    t.animate(
      [{ transform: "translateY(0px)" }, { transform: "translateY(-2px)" }, { transform: "translateY(0px)" }],
      { duration: 220, easing: "ease-out" }
    );
  });
}

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function init() {
  setYear();
  setupNav();
  setupGlobalAddToCart();
  renderCartBadge();
  renderHome();
  renderMenuPage();
  renderOrderPage();
  renderContactPage();
  document.addEventListener("cart:updated", (e) => renderCartBadge(e.detail));
}

init();
