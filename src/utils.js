/**
 * @ignore
 */
export const dispatch = (s, e) => s.events[e].forEach(f => f.apply(s));