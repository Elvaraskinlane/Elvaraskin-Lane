<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Headless_WP_Auth_REST_API {

    public function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_endpoints' ) );
    }

    public function register_endpoints() {
        register_rest_route( 'headless-auth/v1', '/forgot-password', array(
            'methods'  => 'POST',
            'callback' => array( $this, 'forgot_password_handler' ),
            'permission_callback' => '__return_true'
        ) );

        register_rest_route( 'headless-auth/v1', '/reset-password', array(
            'methods'  => 'POST',
            'callback' => array( $this, 'reset_password_handler' ),
            'permission_callback' => '__return_true'
        ) );
    }

    public function forgot_password_handler( WP_REST_Request $request ) {
        $email = $request->get_param( 'email' );

        if ( empty( $email ) ) {
            return new WP_Error( 'missing_email', 'Email is required.', array( 'status' => 400 ) );
        }

        $user = get_user_by( 'email', $email );

        if ( ! $user ) {
            // For security, don't reveal if a user exists or not, just return success.
            return rest_ensure_response( array( 'message' => 'If the email exists, a reset link has been sent.' ) );
        }

        // Generate the native WordPress reset key
        $key = get_password_reset_key( $user );
        if ( is_wp_error( $key ) ) {
            return new WP_Error( 'key_generation_failed', 'Could not generate reset key.', array( 'status' => 500 ) );
        }

        // Get Frontend URL from settings
        $frontend_url = get_option( 'headless_auth_frontend_url', '' );
        
        if ( empty( $frontend_url ) ) {
            return new WP_Error( 'missing_frontend_url', 'Frontend URL is not configured in Headless Auth settings.', array( 'status' => 500 ) );
        }

        // Remove trailing slash if present
        $frontend_url = rtrim( $frontend_url, '/' );

        // Construct the reset link
        $reset_link = $frontend_url . '/reset-password?key=' . $key . '&login=' . rawurlencode( $user->user_login );

        // Send Email
        $site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
        $message = "Someone has requested a password reset for the following account:\r\n\r\n";
        $message .= sprintf( 'Site Name: %s', $site_name ) . "\r\n\r\n";
        $message .= sprintf( 'Username: %s', $user->user_login ) . "\r\n\r\n";
        $message .= "If this was a mistake, just ignore this email and nothing will happen.\r\n\r\n";
        $message .= "To reset your password, visit the following address:\r\n\r\n";
        $message .= $reset_link . "\r\n";

        $title = sprintf( '[%s] Password Reset', $site_name );
        $title = apply_filters( 'retrieve_password_title', $title, $user->user_login, $user->data );
        $message = apply_filters( 'retrieve_password_message', $message, $key, $user->user_login, $user->data );

        $sent = wp_mail( $user->user_email, wp_specialchars_decode( $title ), $message );

        if ( ! $sent ) {
            return new WP_Error( 'email_failed', 'The email could not be sent. Please check your server settings.', array( 'status' => 500 ) );
        }

        return rest_ensure_response( array( 'message' => 'If the email exists, a reset link has been sent.' ) );
    }

    public function reset_password_handler( WP_REST_Request $request ) {
        $key = $request->get_param( 'key' );
        $login = $request->get_param( 'login' );
        $new_password = $request->get_param( 'new_password' );

        if ( empty( $key ) || empty( $login ) || empty( $new_password ) ) {
            return new WP_Error( 'missing_params', 'Key, login, and new_password are required.', array( 'status' => 400 ) );
        }

        // Validate the reset key
        $user = check_password_reset_key( $key, $login );

        if ( is_wp_error( $user ) ) {
            return new WP_Error( 'invalid_key', 'The reset key is invalid or has expired.', array( 'status' => 400 ) );
        }

        // Reset the password
        reset_password( $user, $new_password );

        return rest_ensure_response( array( 'message' => 'Password reset successfully.' ) );
    }
}
