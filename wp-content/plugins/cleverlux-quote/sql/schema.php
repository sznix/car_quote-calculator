<?php
// phpcs:ignoreFile WordPress.Files.FileName.NotMatch -- keeping legacy name
namespace CleverLux\Quote;

class Schema {
	public static function create_table(): void {
		global $wpdb;
		$table           = $wpdb->prefix . 'cleverlux_bookings';
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS $table (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            start_at DATETIME NOT NULL,
            end_at DATETIME NOT NULL,
            duration INT NOT NULL,
            size VARCHAR(20) NOT NULL,
            package VARCHAR(20) NOT NULL,
            addons LONGTEXT NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            customer_id BIGINT(20) UNSIGNED NOT NULL,
            PRIMARY KEY (id),
            KEY start_at (start_at)
        ) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}
}
