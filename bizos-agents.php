<?php
/**
 * Plugin Name: BizOS Agents
 * Description: Replaces the shop with an AI Agents page (n8n-style workflow showcase, Get yours form and AI consultant chat).
 * Version: 1.0.0
 * Author: BizOS by Evomoda
 */

if (!defined('ABSPATH')) exit;

const BZA_SLUG = 'agents';

function bza_ensure_page() {
    $page = get_page_by_path(BZA_SLUG);
    if (!$page) {
        wp_insert_post([
            'post_title'   => 'AI Agents',
            'post_name'    => BZA_SLUG,
            'post_status'  => 'publish',
            'post_type'    => 'page',
            'post_content' => '<!-- wp:shortcode -->[bizos_agents]<!-- /wp:shortcode -->',
        ]);
    }
}
register_activation_hook(__FILE__, 'bza_ensure_page');
add_action('admin_init', 'bza_ensure_page');

function bza_url() { return home_url('/' . BZA_SLUG . '/'); }

// Old shop and product URLs go to the agents page.
add_action('template_redirect', function () {
    $is_shop = function_exists('is_woocommerce') && (is_shop() || is_product() || is_product_category() || is_product_tag() || is_cart() || is_checkout());
    $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
    if ($is_shop || preg_match('#^(shop|products?|product-category|product-tag|cart|checkout)(/|$)#', $path)) {
        wp_safe_redirect(bza_url(), 301);
        exit;
    }
});

// Menu items pointing at the shop/products now point at Agents.
add_filter('wp_nav_menu_objects', function ($items) {
    foreach ($items as $item) {
        $t = strtolower(trim(wp_strip_all_tags($item->title)));
        if (in_array($t, ['shop', 'products', 'product', 'store'], true) || preg_match('#/(shop|products?)(/|$)#', (string) $item->url)) {
            $item->title = 'Agents';
            $item->url = bza_url();
        }
    }
    return $items;
});

// Block-theme navigation links (core/navigation-link) labelled Shop/Products.
add_filter('render_block', function ($html, $block) {
    if (!in_array($block['blockName'] ?? '', ['core/navigation-link', 'core/navigation-submenu', 'core/page-list-item'], true)) return $html;
    $label = strtolower(trim(wp_strip_all_tags($block['attrs']['label'] ?? $html)));
    $url = (string) ($block['attrs']['url'] ?? '');
    if (in_array($label, ['shop', 'products', 'product', 'store'], true) || preg_match('#/(shop|products?)(/|$)#', $url)) {
        $html = preg_replace('#href="[^"]*"#', 'href="' . esc_url(bza_url()) . '"', $html, 1);
        $html = preg_replace('#>\s*(Shop|Products?|Store)\s*<#i', '>Agents<', $html);
    }
    return $html;
}, 10, 2);

// Keep LiteSpeed from delaying the agents script until user interaction.
add_filter('script_loader_tag', function ($tag, $handle) {
    return $handle === 'bza' ? str_replace(' src=', ' data-no-optimize="1" data-no-defer="1" src=', $tag) : $tag;
}, 10, 2);

add_action('wp_enqueue_scripts', function () {
    if (!is_page(BZA_SLUG)) return;
    $v = '1.0.2';
    wp_enqueue_style('bza-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap', [], null);
    wp_enqueue_style('bza', plugins_url('assets/agents.css', __FILE__), [], $v);
    wp_enqueue_script('bza', plugins_url('assets/agents.js', __FILE__), [], $v, true);
});

add_shortcode('bizos_agents', function () {
    ob_start(); ?>
<div class="bza">
  <section class="bza-hero">
    <h1>AI agents that run your business 24x7</h1>
    <p>Ready-made n8n workflows, set up for you in days. Pick an agent below.</p>
  </section>
  <section class="bza-show">
    <div class="bza-tabs" role="tablist"></div>
    <div class="bza-stage">
      <div class="bza-copy"></div>
      <div class="bza-canvas"><svg viewBox="0 0 1000 440" role="img"></svg></div>
    </div>
  </section>
  <section class="bza-custom">
    <div><h3>Need a custom workflow?</h3><p class="bza-lead">Tell our AI consultant what you want to automate. It will suggest the right agent and our team will WhatsApp you.</p>
      <button class="bza-cta" data-get="">GET YOURS</button></div>
    <div class="bza-chat">
      <div class="bza-log" aria-live="polite"></div>
      <form class="bza-cf"><input placeholder="What do you want to automate?" autocomplete="off" maxlength="2000"><button class="bza-cta">SEND</button></form>
    </div>
  </section>
  <dialog class="bza-dlg">
    <h3>Get your agent</h3>
    <div class="bza-msg">We'll WhatsApp you within 24 hours.</div>
    <form class="bza-lf">
      <input name="name" placeholder="Your name" required maxlength="150">
      <input name="phone" placeholder="WhatsApp number" required inputmode="tel" maxlength="20">
      <input name="email" type="email" placeholder="Email (optional)">
      <input name="business" placeholder="Your business (e.g. salon, garments)" maxlength="150">
      <textarea name="note" rows="2" placeholder="Anything specific? (optional)" maxlength="1000"></textarea>
      <div class="bza-msg bza-lmsg"></div>
      <div class="bza-row"><button type="button" class="bza-cta bza-ghost bza-cancel">CANCEL</button><button class="bza-cta bza-lsub">GET YOURS</button></div>
    </form>
  </dialog>
</div>
<?php
    return ob_get_clean();
});
