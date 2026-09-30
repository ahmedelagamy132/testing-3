<?php
/**
 * Plugin Name: Miduva headless blog
 * Description: Tells the Next.js site to refresh /blog when content changes, and trims WordPress features the headless setup does not use.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Ask Next.js to drop its cached blog data. Non-blocking, so saving a post is
 * never slowed down by the site.
 */
function miduva_revalidate_blog(): void
{
    static $sent = false;
    $secret = getenv('WP_REVALIDATE_SECRET');
    if ($sent || !$secret) {
        return;
    }
    $sent = true;
    wp_remote_post('http://nextjs:3000/api/blog/revalidate', [
        'blocking' => false,
        'timeout'  => 2,
        'headers'  => ['X-Revalidate-Secret' => $secret],
    ]);
}

add_action('transition_post_status', function ($new, $old, $post) {
    if ($post instanceof WP_Post && $post->post_type === 'post' && ($new === 'publish' || $old === 'publish')) {
        miduva_revalidate_blog();
    }
}, 10, 3);
add_action('post_updated', function ($id, $after) {
    if ($after->post_type === 'post' && $after->post_status === 'publish') {
        miduva_revalidate_blog();
    }
}, 10, 2);
foreach (['created_category', 'edited_category', 'delete_category', 'profile_update'] as $hook) {
    add_action($hook, 'miduva_revalidate_blog');
}

// The public site is Next.js; WordPress only serves the admin and REST API.
add_filter('xmlrpc_enabled', '__return_false');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_generator');
