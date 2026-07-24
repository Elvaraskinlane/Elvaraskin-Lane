<?php
/**
 * Plugin Name: Headless WP Auth
 * Plugin URI:  https://github.com/
 * Description: A reusable headless authentication plugin providing REST APIs for forgot and reset password functionality.
 * Version:     1.0.0
 * Author:      Headless Developer
 * Author URI:  https://github.com/
 * License:     GPLv2 or later
 * Text Domain: headless-wp-auth
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

define( 'HEADLESS_WP_AUTH_VERSION', '1.0.0' );
define( 'HEADLESS_WP_AUTH_DIR', plugin_dir_path( __FILE__ ) );
define( 'HEADLESS_WP_AUTH_URL', plugin_dir_url( __FILE__ ) );

// Include necessary files
require_once HEADLESS_WP_AUTH_DIR . 'includes/class-settings.php';
require_once HEADLESS_WP_AUTH_DIR . 'includes/class-rest-api.php';

// Initialize the plugin
function headless_wp_auth_init() {
    new Headless_WP_Auth_Settings();
    new Headless_WP_Auth_REST_API();
}
add_action( 'plugins_loaded', 'headless_wp_auth_init' );
