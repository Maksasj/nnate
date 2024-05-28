#ifndef LEMON_H
#define LEMON_H

typedef unsigned long long lemon_size_t;
typedef unsigned char lemon_byte_t;

// Fingerprint is used for memory corruption
#define LEMON_FINGERPRINT 0x824d268524c2d0c2 
#define LEMON_NULL ((void*) 0)
#define LEMON_INLINE static inline

#ifndef LEMON_ASSERT
    #include <assert.h>
    #define LEMON_ASSERT assert
#endif

#ifndef LEMONA_PRINT
    #include <stdio.h>
    #define LEMONA_PRINT printf
#endif

typedef struct lemon_chunk_t {
    lemon_size_t fingerprint;

	lemon_size_t size;
	lemon_byte_t inuse;
    
	struct lemon_chunk_t* next;
	struct lemon_chunk_t* prev;
} lemon_chunk_t;

static lemon_byte_t* lemon_memp; 

LEMON_INLINE void lemon_init();

LEMON_INLINE void* lemon_malloc(lemon_size_t size);
LEMON_INLINE void lemon_free(void* block);

LEMON_INLINE void lemon_print();

#ifdef LEMON_IMPLEMENTATION

LEMON_INLINE void lemon_init(lemon_byte_t* heap, lemon_size_t size) {
    lemon_memp = heap;

    lemon_chunk_t* first = (lemon_chunk_t*) lemon_memp;

    first->size = size - sizeof(lemon_chunk_t);
    first->inuse = 0;
    first->next = LEMON_NULL;
    first->prev = LEMON_NULL;
    first->fingerprint = LEMON_FINGERPRINT;
}

LEMON_INLINE void* lemon_malloc(lemon_size_t size) {
    lemon_chunk_t* chunk = (lemon_chunk_t*) lemon_memp; 
    
    LEMON_ASSERT(chunk->fingerprint == LEMON_FINGERPRINT);

    while((chunk->inuse == 1) || (size > chunk->size)) {
        chunk = chunk->next;

        if(chunk == LEMON_NULL)
            return LEMON_NULL;
    }

    LEMON_ASSERT(chunk->fingerprint == LEMON_FINGERPRINT);

    void* ret = chunk + sizeof(lemon_chunk_t);
    lemon_chunk_t* next = (lemon_chunk_t*) ((lemon_byte_t* )ret + size);

    next->size = chunk->size - sizeof(lemon_chunk_t) - size;
    next->next = LEMON_NULL;
    next->inuse = 0;
    next->prev = chunk;
    next->fingerprint = LEMON_FINGERPRINT;

    chunk->size = size;
    chunk->inuse = 1;
    chunk->next = next;

    return ret;  
}

LEMON_INLINE void lemon_free(void* ptr) {
    if(ptr == LEMON_NULL)
        return;
    
    lemon_chunk_t* chunk = (lemon_chunk_t*) ptr - sizeof(lemon_chunk_t);
    LEMON_ASSERT(chunk->fingerprint == LEMON_FINGERPRINT);

    lemon_chunk_t* prev = chunk->prev;
    lemon_chunk_t* next = chunk->next;

    chunk->inuse = 0;

    if(prev != LEMON_NULL && prev->inuse == 0) {
        LEMON_ASSERT(prev->fingerprint == LEMON_FINGERPRINT);

        prev->size += sizeof(lemon_chunk_t) + chunk->size;
        prev->next = next;
        chunk = prev;
    }

    if(next != LEMON_NULL && next->inuse == 0) {
        LEMON_ASSERT(next->fingerprint == LEMON_FINGERPRINT);

        chunk->size += sizeof(lemon_chunk_t) + next->size;
        chunk->next = next->next;
    }
}

LEMON_INLINE void lemon_print() {
    lemon_chunk_t* chunk = (lemon_chunk_t*) lemon_memp; 

    LEMON_ASSERT(chunk->fingerprint == LEMON_FINGERPRINT);

    while(1) {
        LEMONA_PRINT("[%llu; %d],", chunk->size, chunk->inuse);

        if(chunk->next == LEMON_NULL)
            break;

        chunk = chunk->next;
    }

    LEMONA_PRINT("\n");
}

#endif

#endif 