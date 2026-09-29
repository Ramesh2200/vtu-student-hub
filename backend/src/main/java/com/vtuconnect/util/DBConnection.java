package com.vtuconnect.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * High-performance JDBC Connection Utility using HikariCP connection pooling
 * with resilient fallback to direct MySQL JDBC connection.
 */
public class DBConnection {
    private static final Logger LOGGER = Logger.getLogger(DBConnection.class.getName());
    private static HikariDataSource dataSource;

    private static String jdbcUrl = "jdbc:mysql://localhost:3306/vtu_student_connect?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static String dbUser = "root";
    private static String dbPassword = "root"; // can be overridden by system env / db.properties

    static {
        loadConfig();
        initDataSource();
    }

    private static void loadConfig() {
        try (InputStream is = DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (is != null) {
                Properties props = new Properties();
                props.load(is);
                if (props.getProperty("db.url") != null) jdbcUrl = props.getProperty("db.url");
                if (props.getProperty("db.user") != null) dbUser = props.getProperty("db.user");
                if (props.getProperty("db.password") != null) dbPassword = props.getProperty("db.password");
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "db.properties not found or error loading, using defaults / env: " + e.getMessage());
        }

        // Environment variable overrides
        String envUrl = System.getenv("DB_URL");
        if (envUrl != null && !envUrl.isBlank()) jdbcUrl = envUrl;

        String envUser = System.getenv("DB_USER");
        if (envUser != null && !envUser.isBlank()) dbUser = envUser;

        String envPass = System.getenv("DB_PASSWORD");
        if (envPass != null) dbPassword = envPass;
    }

    private static synchronized void initDataSource() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(dbUser);
            config.setPassword(dbPassword);
            config.setMaximumPoolSize(15);
            config.setMinimumIdle(3);
            config.setIdleTimeout(30000);
            config.setConnectionTimeout(10000);
            config.setMaxLifetime(1800000);
            config.setPoolName("VTUConnectHikariPool");

            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            config.addDataSourceProperty("useServerPrepStmts", "true");

            dataSource = new HikariDataSource(config);
            LOGGER.info("HikariCP connection pool initialized successfully for " + jdbcUrl);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to initialize HikariCP dataSource: " + e.getMessage(), e);
        }
    }

    /**
     * Obtains a connection from HikariCP pool, falling back to DriverManager if needed.
     */
    public static Connection getConnection() throws SQLException {
        if (dataSource != null && !dataSource.isClosed()) {
            return dataSource.getConnection();
        }
        return DriverManager.getConnection(jdbcUrl, dbUser, dbPassword);
    }

    /**
     * Safely closes JDBC resources without throwing checked exceptions.
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        if (rs != null) {
            try { rs.close(); } catch (SQLException ignored) {}
        }
        if (stmt != null) {
            try { stmt.close(); } catch (SQLException ignored) {}
        }
        if (conn != null) {
            try { conn.close(); } catch (SQLException ignored) {}
        }
    }

    public static void close(Connection conn, Statement stmt) {
        close(conn, stmt, null);
    }

    public static void close(Connection conn) {
        close(conn, null, null);
    }

    public static void shutdown() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
