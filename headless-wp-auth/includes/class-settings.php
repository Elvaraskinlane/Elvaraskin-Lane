<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Headless_WP_Auth_Settings {

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
    }

    public function add_plugin_page() {
        add_options_page(
            'Headless Auth Settings', 
            'Headless Auth', 
            'manage_options', 
            'headless-auth', 
            array( $this, 'create_admin_page' )
        );
    }

    public function create_admin_page() {
        ?>
        <div class="wrap">
            <h1>Headless Auth Settings</h1>
            <form method="post" action="options.php">
            <?php
                settings_fields( 'headless_auth_option_group' );
                do_settings_sections( 'headless-auth-admin' );
                submit_button();
            ?>
            </form>
        </div>
        <?php
    }

    public function page_init() {
        register_setting(
            'headless_auth_option_group',
            'headless_auth_frontend_url',
            array( $this, 'sanitize' )
        );

        add_settings_section(
            'setting_section_id',
            'Frontend Application Settings',
            array( $this, 'print_section_info' ),
            'headless-auth-admin'
        );

        add_settings_field(
            'headless_auth_frontend_url',
            'Frontend URL',
            array( $this, 'frontend_url_callback' ),
            'headless-auth-admin',
            'setting_section_id'
        );
    }

    public function sanitize( $input ) {
        return esc_url_raw( $input );
    }

    public function print_section_info() {
        print 'Enter the base URL of your Next.js application (e.g., https://elvaraskinlane.com). This is used to build the reset password link in emails.';
    }

    public function frontend_url_callback() {
        $val = get_option( 'headless_auth_frontend_url' );
        printf(
            '<input type="text" id="headless_auth_frontend_url" name="headless_auth_frontend_url" value="%s" style="width: 400px;" placeholder="https://example.com" />',
            isset( $val ) ? esc_attr( $val ) : ''
        );
    }
}
