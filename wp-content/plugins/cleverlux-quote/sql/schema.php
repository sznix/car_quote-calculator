<?php
namespace CleverLux\Quote;

use wpdb;

class Schema {
    public static function create_table( wpdb $wpdb ) : void {
        $table = $wpdb->prefix . 'cleverlux_bookings';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            start DATETIME NOT NULL,
            end DATETIME NOT NULL,
            duration INT NOT NULL,
            size VARCHAR(20) NOT NULL,
            package VARCHAR(20) NOT NULL,
            addons JSON NOT NULL,
            status VARCHAR(20) NOT NULL,
            customer_id BIGINT(20) UNSIGNED NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }
}
