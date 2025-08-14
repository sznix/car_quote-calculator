(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // assets/js/components/VehicleSizeTiles.js
  var require_VehicleSizeTiles = __commonJS({
    "assets/js/components/VehicleSizeTiles.js"(exports, module) {
      var SIZES = [
        ["sedan", "Sedan"],
        ["sports", "Sports"],
        ["small_suv", "Small SUV"],
        ["large_suv", "Large SUV"],
        ["full_van", "Full Van"],
        ["boat", "Boat"]
      ];
      function renderVehicleSizeTiles({ selected, onSelect } = {}) {
        let current = selected || null;
        const container = document.createElement("div");
        function updatePressed() {
          for (const child of container.children) {
            const value = child.getAttribute("data-value");
            const isPressed = value === current;
            child.setAttribute("aria-pressed", String(isPressed));
            child.style.background = isPressed ? "#e0e0e0" : "";
          }
        }
        function handleSelect(value) {
          var _a;
          current = value;
          updatePressed();
          if (typeof navigator !== "undefined") {
            (_a = navigator.vibrate) == null ? void 0 : _a.call(navigator, 10);
          }
          if (typeof onSelect === "function") {
            onSelect(value);
          }
        }
        for (const [value, label] of SIZES) {
          const tile = document.createElement("div");
          tile.className = "vehicle-size-tile";
          tile.tabIndex = 0;
          tile.setAttribute("role", "button");
          tile.setAttribute("data-value", value);
          tile.setAttribute("aria-pressed", String(value === current));
          tile.textContent = label;
          tile.addEventListener("click", () => handleSelect(value));
          tile.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelect(value);
            }
          });
          tile.addEventListener("focus", () => {
            tile.style.outline = "2px solid #2684ff";
            tile.style.outlineOffset = "2px";
          });
          tile.addEventListener("blur", () => {
            tile.style.outline = "";
            tile.style.outlineOffset = "";
          });
          container.appendChild(tile);
        }
        updatePressed();
        return container;
      }
      module.exports = renderVehicleSizeTiles;
    }
  });

  // assets/js/data/vehicle-models.json
  var require_vehicle_models = __commonJS({
    "assets/js/data/vehicle-models.json"(exports, module) {
      module.exports = [
        { make: "Audi", model: "A4", size: "sedan" },
        { make: "BMW", model: "3 Series", size: "sedan" },
        { make: "Chevrolet", model: "Malibu", size: "sedan" },
        { make: "Ford", model: "Fusion", size: "sedan" },
        { make: "Honda", model: "Accord", size: "sedan" },
        { make: "Hyundai", model: "Sonata", size: "sedan" },
        { make: "Kia", model: "Optima", size: "sedan" },
        { make: "Mercedes-Benz", model: "C-Class", size: "sedan" },
        { make: "Nissan", model: "Altima", size: "sedan" },
        { make: "Toyota", model: "Camry", size: "sedan" },
        { make: "Audi", model: "TT", size: "sports" },
        { make: "BMW", model: "M3", size: "sports" },
        { make: "Chevrolet", model: "Corvette", size: "sports" },
        { make: "Dodge", model: "Challenger", size: "sports" },
        { make: "Ford", model: "Mustang", size: "sports" },
        { make: "Mazda", model: "MX-5", size: "sports" },
        { make: "Nissan", model: "370Z", size: "sports" },
        { make: "Porsche", model: "911", size: "sports" },
        { make: "Subaru", model: "BRZ", size: "sports" },
        { make: "Toyota", model: "Supra", size: "sports" },
        { make: "Chevrolet", model: "Equinox", size: "small_suv" },
        { make: "Ford", model: "Escape", size: "small_suv" },
        { make: "Honda", model: "CR-V", size: "small_suv" },
        { make: "Hyundai", model: "Tucson", size: "small_suv" },
        { make: "Kia", model: "Sportage", size: "small_suv" },
        { make: "Mazda", model: "CX-5", size: "small_suv" },
        { make: "Nissan", model: "Rogue", size: "small_suv" },
        { make: "Subaru", model: "Forester", size: "small_suv" },
        { make: "Toyota", model: "RAV4", size: "small_suv" },
        { make: "Volkswagen", model: "Tiguan", size: "small_suv" },
        { make: "BMW", model: "X7", size: "large_suv" },
        { make: "Cadillac", model: "Escalade", size: "large_suv" },
        { make: "Chevrolet", model: "Tahoe", size: "large_suv" },
        { make: "Dodge", model: "Durango", size: "large_suv" },
        { make: "Ford", model: "Expedition", size: "large_suv" },
        { make: "GMC", model: "Yukon", size: "large_suv" },
        { make: "Jeep", model: "Grand Cherokee", size: "large_suv" },
        { make: "Mercedes-Benz", model: "GLS", size: "large_suv" },
        { make: "Nissan", model: "Armada", size: "large_suv" },
        { make: "Toyota", model: "Sequoia", size: "large_suv" },
        { make: "Chevrolet", model: "Express", size: "full_van" },
        { make: "Ford", model: "Transit", size: "full_van" },
        { make: "GMC", model: "Savana", size: "full_van" },
        { make: "Mercedes-Benz", model: "Sprinter", size: "full_van" },
        { make: "Nissan", model: "NV Cargo", size: "full_van" },
        { make: "Ram", model: "ProMaster", size: "full_van" },
        { make: "Toyota", model: "HiAce", size: "full_van" },
        { make: "Volkswagen", model: "Transporter", size: "full_van" },
        { make: "Bayliner", model: "175", size: "boat" },
        { make: "Boston Whaler", model: "170", size: "boat" },
        { make: "Chaparral", model: "SSi 21", size: "boat" },
        { make: "Lund", model: "1650 Rebel", size: "boat" },
        { make: "Malibu", model: "Wakesetter", size: "boat" },
        { make: "MasterCraft", model: "NXT22", size: "boat" },
        { make: "Regal", model: "26 Express", size: "boat" },
        { make: "Sea Ray", model: "Sundancer", size: "boat" },
        { make: "Tracker", model: "Pro Team 175", size: "boat" },
        { make: "Yamaha", model: "AR190", size: "boat" }
      ];
    }
  });

  // assets/js/hooks/useVehicleLookup.js
  var require_useVehicleLookup = __commonJS({
    "assets/js/hooks/useVehicleLookup.js"(exports, module) {
      var models = require_vehicle_models();
      var index;
      var ALIASES = {
        "c class": "mercedes benz c class",
        "mercedes c class": "mercedes benz c class"
      };
      function normalize(str) {
        return str.toLowerCase().replace(/[^\w\s]+/g, " ").replace(/\s+/g, " ").trim();
      }
      function getIndex() {
        if (!index) {
          index = /* @__PURE__ */ new Map();
          for (const { make, model, size } of models) {
            const key = normalize(`${make} ${model}`);
            index.set(key, size);
          }
        }
        return index;
      }
      function lookupVehicleSize(name) {
        if (typeof name !== "string") return null;
        const normalized = normalize(name);
        const key = ALIASES[normalized] || normalized;
        return getIndex().get(key) || null;
      }
      module.exports = lookupVehicleSize;
    }
  });

  // assets/js/steps/SizeStep.js
  var require_SizeStep = __commonJS({
    "assets/js/steps/SizeStep.js"(exports, module) {
      var renderVehicleSizeTiles = require_VehicleSizeTiles();
      var lookupVehicleSize = require_useVehicleLookup();
      function renderSizeStep2({ onNext } = {}) {
        let selected = null;
        let nextBtn;
        const root = document.createElement("div");
        const tiles = renderVehicleSizeTiles({
          onSelect(value) {
            selected = value;
            nextBtn.disabled = !selected;
          }
        });
        root.appendChild(tiles);
        const actions = document.createElement("div");
        actions.style.marginTop = "1rem";
        root.appendChild(actions);
        const unsureBtn = document.createElement("button");
        unsureBtn.type = "button";
        unsureBtn.textContent = "Not sure?";
        actions.appendChild(unsureBtn);
        nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.textContent = "Confirm";
        nextBtn.disabled = true;
        nextBtn.style.marginLeft = "0.5rem";
        actions.appendChild(nextBtn);
        nextBtn.addEventListener("click", () => {
          if (selected && typeof onNext === "function") {
            onNext(selected);
          }
        });
        unsureBtn.addEventListener("click", openModal);
        function openModal() {
          const overlay = document.createElement("div");
          overlay.style.position = "fixed";
          overlay.style.top = 0;
          overlay.style.left = 0;
          overlay.style.right = 0;
          overlay.style.bottom = 0;
          overlay.style.background = "rgba(0,0,0,0.3)";
          overlay.style.display = "flex";
          overlay.style.alignItems = "center";
          overlay.style.justifyContent = "center";
          overlay.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          });
          const modal = document.createElement("div");
          modal.style.background = "#fff";
          modal.style.padding = "1rem";
          modal.style.borderRadius = "4px";
          modal.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
          modal.setAttribute("role", "dialog");
          modal.setAttribute("aria-modal", "true");
          modal.setAttribute("aria-label", "Vehicle model lookup");
          overlay.appendChild(modal);
          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = "Enter make and model";
          input.setAttribute("aria-label", "Vehicle make and model");
          modal.appendChild(input);
          const confirm = document.createElement("button");
          confirm.type = "button";
          confirm.textContent = "Use";
          confirm.style.marginLeft = "0.5rem";
          modal.appendChild(confirm);
          const cancel = document.createElement("button");
          cancel.type = "button";
          cancel.textContent = "Cancel";
          cancel.style.marginLeft = "0.5rem";
          modal.appendChild(cancel);
          document.body.appendChild(overlay);
          input.focus();
          let suggested = null;
          function highlightSuggestion(value) {
            for (const child of tiles.children) {
              const match = child.getAttribute("data-value") === value;
              child.style.outline = match ? "2px dashed #2684ff" : "";
              child.style.outlineOffset = match ? "2px" : "";
            }
          }
          input.addEventListener("input", () => {
            suggested = lookupVehicleSize(input.value);
            highlightSuggestion(suggested);
          });
          confirm.addEventListener("click", () => {
            if (suggested) {
              const tile = tiles.querySelector(`[data-value="${suggested}"]`);
              if (tile) {
                tile.click();
              }
            }
            close();
          });
          cancel.addEventListener("click", close);
          function close() {
            overlay.remove();
            highlightSuggestion(null);
            unsureBtn.focus();
          }
        }
        return root;
      }
      module.exports = renderSizeStep2;
    }
  });

  // assets/js/bootstrap.js
  var renderSizeStep = require_SizeStep();
  function mount() {
    const container = document.querySelector(".cleverlux-quote");
    if (!container) return;
    const step = renderSizeStep({
      onNext(slug) {
        console.log("selected size", slug);
      }
    });
    container.appendChild(step);
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount);
    } else {
      mount();
    }
  }
})();
