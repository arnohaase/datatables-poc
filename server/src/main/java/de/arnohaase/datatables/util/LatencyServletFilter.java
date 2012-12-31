package de.arnohaase.datatables.util;

import java.io.IOException;

import javax.servlet.*;

import org.apache.log4j.Logger;


public class LatencyServletFilter implements Filter {
    public static final int LATENCY_MILLIS = 600; //TODO make this configurable
    
    private static final Logger log = Logger.getLogger(LatencyServletFilter.class);
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        try {
            log.info("delaying request for " + LATENCY_MILLIS + "ms.");
            Thread.sleep(LATENCY_MILLIS);
            chain.doFilter(request, response);
        } catch (InterruptedException e) {
            throw new ServletException(e);
        }
    }

    @Override
    public void destroy() {
    }
}
