#define LEMON_IMPLEMENTATION
#include "lemon.h"

int main() {
    lemon_byte_t heap[4096];

    lemon_init(heap, 4096);

    lemon_print();

    void* p32 = lemon_malloc(32);
    lemon_print();

    void* p64 = lemon_malloc(64);
    lemon_print();
    
    void* p128 = lemon_malloc(128);
    lemon_print();

    void* p256 = lemon_malloc(256);
    lemon_print();

    void* p512 = lemon_malloc(512);
    lemon_print();

    lemon_free(p128);
    lemon_print();

    lemon_free(p512);
    lemon_print();

    lemon_free(p256);
    lemon_print();

    lemon_free(p32);
    lemon_print();

    lemon_free(p64);
    lemon_print();

    return 0;
}